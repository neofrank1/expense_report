'use server';

import { db } from "@/db/drizzle";
import { expense_categories, users, user_expenses } from "@/db/schema";
import { and, eq, gte, lte, sql, ilike, desc } from "drizzle-orm";
import { Expense, ExpenseSearchParams } from "@/types/expense.types";
import { currentUser } from "@clerk/nextjs/server";

export async function getExpenseCategories() {
    const expenseCategories = await db.select().from(expense_categories);
    return expenseCategories;
}

export async function insertExpense(expense: Expense) {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }
    
    try {
        // Ensure user exists in the users table
        const existingUser = await db.select().from(users).where(eq(users.clerk_id, user.id)).limit(1);
        
        if (existingUser.length === 0) {
            try {
                // Create user if they don't exist
                await db.insert(users).values({
                    clerk_id: user.id,
                    email: user.emailAddresses[0]?.emailAddress || '',
                    full_name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
                });
            } catch (userError: any) {
                // User might have been created by another request (race condition)
                // Only throw if it's not a unique constraint violation
                if (!userError?.message?.includes('unique') && !userError?.code?.includes('23505')) {
                    throw userError;
                }
            }
        }
        
        await db.insert(user_expenses).values({
            name: expense.name,
            amount: expense.amount,
            date: expense.date,
            category_id: expense.category_id,
            description: expense.description,
            user_id: user.id,
        });
    } catch (error) {
        console.error("Database error:", error);
        throw new Error(`Failed to insert expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getExpenses() {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }

    // Group expenses by category and sum the amounts for current month only
    const expenses = await db
        .select({
            category_id: user_expenses.category_id,
            category_name: sql<string>`COALESCE(${expense_categories.name}, 'Uncategorized')`.as('category_name'),
            total_amount: sql<number>`COALESCE(SUM(${user_expenses.amount}), 0)`.as('total_amount'),
            count: sql<number>`COUNT(${user_expenses.id})`.as('count')
        })
        .from(user_expenses)
        .leftJoin(expense_categories, eq(user_expenses.category_id, expense_categories.id))
        .where(
            and(
                eq(user_expenses.user_id, user.id),
                sql`EXTRACT(YEAR FROM ${user_expenses.date}) = EXTRACT(YEAR FROM CURRENT_DATE)`,
                sql`EXTRACT(MONTH FROM ${user_expenses.date}) = EXTRACT(MONTH FROM CURRENT_DATE)`
            )
        )
        .groupBy(user_expenses.category_id, expense_categories.name);
    
    return expenses;
}


export async function getExpensesByMonth() {
    const user = await currentUser();
    
    if (!user) {
        throw new Error("User not found");
    }

    const total_month = await db
        .select({
            month: sql<string>`TO_CHAR(${user_expenses.date}, 'YYYY-MM')`.as('month'),
            year: sql<number>`EXTRACT(YEAR FROM ${user_expenses.date})`.as('year'),
            month_number: sql<number>`EXTRACT(MONTH FROM ${user_expenses.date})`.as('month_number'),
            total_amount: sql<number>`COALESCE(SUM(${user_expenses.amount}), 0)`.as('total_amount'),
            count: sql<number>`COUNT(${user_expenses.id})`.as('count')
        })
        .from(user_expenses)
        .where(eq(user_expenses.user_id, user.id))
        .groupBy(sql`TO_CHAR(${user_expenses.date}, 'YYYY-MM')`, sql`EXTRACT(YEAR FROM ${user_expenses.date})`, sql`EXTRACT(MONTH FROM ${user_expenses.date})`)
        .orderBy(sql`TO_CHAR(${user_expenses.date}, 'YYYY-MM')`);
    
    return total_month;
}


export async function getExpensesByCategory() {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }

    const expenses = await db.select({
        category_id: user_expenses.category_id,
        category_name: sql<string>`COALESCE(${expense_categories.name}, 'Uncategorized')`.as('category_name'),
        total_amount: sql<number>`COALESCE(SUM(${user_expenses.amount}), 0)`.as('total_amount'),
    }).from(user_expenses)
    .leftJoin(expense_categories, eq(user_expenses.category_id, expense_categories.id))
    .where(eq(user_expenses.user_id, user.id))
    .groupBy(user_expenses.category_id, expense_categories.name);

    return expenses;
}

export async function getExpensesBySearchParams(searchParams?: Partial<ExpenseSearchParams>) {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }

    // Build where conditions array
    const conditions = [eq(user_expenses.user_id, user.id)];

    if (searchParams?.expense_name && searchParams.expense_name.trim() !== '') {
        conditions.push(ilike(user_expenses.name, `%${searchParams.expense_name}%`));
    }

    if (searchParams?.expense_amount) {
        const amount = typeof searchParams.expense_amount === 'string' ? parseFloat(searchParams.expense_amount) : searchParams.expense_amount;
        if (!isNaN(amount) && amount > 0) {
            conditions.push(gte(user_expenses.amount, amount));
        }
    }

    if (searchParams?.expense_date) {
        const date = typeof searchParams.expense_date === 'string' ? new Date(searchParams.expense_date) : searchParams.expense_date;
        if (!isNaN(date.getTime())) {
            conditions.push(eq(user_expenses.date, date));
        }
    }

    if (searchParams?.expense_category && searchParams.expense_category !== 0 && searchParams.expense_category !== 'all') {
        const categoryId = typeof searchParams.expense_category === 'string' ? parseInt(searchParams.expense_category) : searchParams.expense_category;
        if (!isNaN(categoryId)) {
            conditions.push(eq(user_expenses.category_id, categoryId));
        }
    }

    // Get individual expenses with category information
    const expenses = await db
        .select({
            id: user_expenses.id,
            name: user_expenses.name,
            amount: user_expenses.amount,
            date: user_expenses.date,
            description: sql<string>`COALESCE(${user_expenses.description}, '')`.as('description'),
            category_id: sql<number>`COALESCE(${user_expenses.category_id}, 0)`.as('category_id'),
            category_name: sql<string>`COALESCE(${expense_categories.name}, 'Uncategorized')`.as('category_name'),
            total_amount: user_expenses.amount
        })
        .from(user_expenses)
        .leftJoin(expense_categories, eq(user_expenses.category_id, expense_categories.id))
        .where(and(...conditions))
        .orderBy(desc(user_expenses.date));
    
    return expenses;
}