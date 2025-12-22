interface Expense {
    name: string;
    amount: number | string;
    date: Date;
    category_id: number;
    description: string;
    user_id: string;
}

interface ExpenseCategoryData {
    category_id: number | null;
    category_name: string;
    total_amount: number | string;
    count: number;
};

interface TotalExpensesByMonth {
    month: string;
    year: number;
    month_number: number;
    total_amount: number | string;
    count: number;
}

interface ExpenseByCategory {
    category_id: number,
    category_name: string,
    total_amount: number | string;
}

interface DashboardLayoutProps {
    userName: string;
    expenseCategories: any[];
    expenses: ExpenseCategoryData[];
    TotalExpensesByMonth: any[];
    expensesByCategory: ExpenseByCategory[];
}

interface ExpenseBySearchParams extends ExpenseByCategory{
    id: number;
    name: string;
    amount: number | string;
    date: Date;
    description: string;
}

type ExpenseSearchParams = {
    expense_name?: string;
    expense_amount?: number | string;
    expense_date?: Date | string;
    expense_category?: number | string;
}

interface ExpenseEditParams extends Expense {
    id: number;
}

export type { Expense, ExpenseCategoryData, TotalExpensesByMonth, ExpenseByCategory, DashboardLayoutProps, ExpenseBySearchParams, ExpenseSearchParams, ExpenseEditParams };