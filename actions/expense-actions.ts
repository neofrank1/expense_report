'use server';

import { db } from "@/db/drizzle";
import { expense_categories, users, user_expenses } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Expense } from "@/types/expense.types";
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

    // Group expenses by category and sum the amounts
    const expenses = await db
        .select({
            category_id: user_expenses.category_id,
            category_name: sql<string>`COALESCE(${expense_categories.name}, 'Uncategorized')`.as('category_name'),
            total_amount: sql<number>`COALESCE(SUM(${user_expenses.amount}), 0)`.as('total_amount'),
            count: sql<number>`COUNT(${user_expenses.id})`.as('count')
        })
        .from(user_expenses)
        .leftJoin(expense_categories, eq(user_expenses.category_id, expense_categories.id))
        .where(eq(user_expenses.user_id, user.id))
        .groupBy(user_expenses.category_id, expense_categories.name);
    
    return expenses;
}