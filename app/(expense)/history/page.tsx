import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AppLayout } from "@/components/layout/app-layout";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HistoryContent } from "@/components/history/history-content";
import { getExpenseCategories, getExpensesBySearchParams } from "@/actions/expense-actions";

export default async function ExpenseHistoryPage() {
    const user = await currentUser();
    if (!user) {
        redirect("/");
    }

    const expenseCategories = await getExpenseCategories();
    const expensesTable = await getExpensesBySearchParams();

    return (
        <AppLayout>
            <DashboardLayout>
                <HistoryContent 
                    expenseCategories={{ categories: expenseCategories }} 
                    expensesTable={{expenses: expensesTable}}
                />
            </DashboardLayout>
        </AppLayout>
    )
}