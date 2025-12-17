import { AppLayout } from "@/components/layout/app-layout";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getExpenseCategories, getExpenses, getExpensesByMonth, getExpensesByCategory } from "@/actions/expense-actions";
import { syncUser } from "@/actions/user-actions";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ExpenseCategoryData, ExpenseByCategory } from "@/types/expense.types";

export default async function DashboardPage() {    
    const user = await currentUser();
    if (!user) {
        redirect("/");
    }

    await syncUser();
    const expenseCategories = await getExpenseCategories();
    const expenses = await getExpenses();
    const TotalExpensesByMonth = await getExpensesByMonth();
    const expensesByCategory = await getExpensesByCategory();

    return (
        <AppLayout>
            <DashboardLayout
                userName={user?.fullName || ''}
                expenseCategories={expenseCategories}
                expenses={expenses as ExpenseCategoryData[]}
                TotalExpensesByMonth={TotalExpensesByMonth}
                expensesByCategory={expensesByCategory as ExpenseByCategory[]}
            />
        </AppLayout>
    );
}