interface Expense {
    name: string;
    amount: number;
    date: Date;
    category_id: number;
    description: string;
    user_id: string;
}

export type { Expense };