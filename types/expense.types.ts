interface Expense {
    name: string;
    amount: number;
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
    total_amount: number;
    count: number;
}

interface ExpenseByCategory {
    category_id: number,
    category_name: string,
    total_amount: number
}

export type { Expense, ExpenseCategoryData, TotalExpensesByMonth };