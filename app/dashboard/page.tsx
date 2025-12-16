import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { TotalSpendingsDashboard } from "@/components/dashboard/dashboardComponents";
import { AddExpenseDashboardButton } from "@/components/dashboard/dashboardComponents";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TotalSpendingsPieChart } from "@/components/dashboard/dashboardComponents";
import { TotalSpendingsPerDayAreaChart } from "@/components/dashboard/dashboardComponents";
import { getExpenseCategories, getExpenses, getExpensesByMonth, getExpensesByCategory } from "@/actions/expense-actions";
import { syncUser } from "@/actions/user-actions";
import { SidebarDashboard } from "@/components/dashboard/sidebar-dashboard";
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
            <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
                <div className="col-span-2 p-4 overflow-hidden">
                    <SidebarDashboard />
                </div>
                <div className="col-span-10 p-4 overflow-y-auto">
                    <div className="grid gap-4">
                        <div className="flex flex-row justify-between items-center">
                            <Text as="h3" className="dark:text-foreground py-2">
                                Welcome, {user?.fullName}, to the Expense Report Dashboard
                            </Text>
                            <AddExpenseDashboardButton categories={expenseCategories}/>
                        </div>
                        <div>
                            <Text as="h3" className="mt-4">Total Spendings by Category</Text>
                        </div>
                        <div className="mt-2">
                            <TotalSpendingsDashboard 
                                className="basis-1/4 p-4"
                                data={expensesByCategory as ExpenseByCategory[]}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mt-4">
                        <div className="col-span-2">
                            <Text as='h3'>Total Spendings</Text>
                            <Card className="mt-2 w-full h-[400px]">
                                <Card.Content className="h-full">
                                    <TotalSpendingsPieChart className="my-5" data={expenses as ExpenseCategoryData[]}/>
                                </Card.Content>
                            </Card>
                        </div>
                        <div className="col-span-3">
                            <Text as='h3'>Total Spendings this Month</Text>
                            <Card className="mt-2 w-full h-[400px] max-w-full">
                                <Card.Content>
                                    <TotalSpendingsPerDayAreaChart className="my-4" data={TotalExpensesByMonth}/>
                                </Card.Content>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}