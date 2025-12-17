'use client';

import { useState } from "react";
import { SidebarDashboard } from "@/components/dashboard/sidebar-dashboard";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Menu, X } from "lucide-react";
import { TotalSpendingsDashboard } from "@/components/dashboard/dashboardComponents";
import { AddExpenseDashboardButton } from "@/components/dashboard/dashboardComponents";
import { TotalSpendingsPieChart } from "@/components/dashboard/dashboardComponents";
import { TotalSpendingsPerDayAreaChart } from "@/components/dashboard/dashboardComponents";
import { ExpenseCategoryData, ExpenseByCategory, DashboardLayoutProps } from "@/types/expense.types";

export function DashboardLayout({
    userName,
    expenseCategories,
    expenses,
    TotalExpensesByMonth,
    expensesByCategory
}: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
            {isSidebarOpen && (
                <div className="col-span-2 p-4 overflow-hidden">
                    <SidebarDashboard />
                </div>
            )}
            <div className={`p-4 overflow-y-auto ${isSidebarOpen ? 'col-span-10' : 'col-span-12'}`}>
                <div className="grid gap-4">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={toggleSidebar}
                                variant="outline"
                                size="icon"
                                className="dark:bg-foreground dark:text-background"
                                aria-label="Toggle sidebar"
                            >
                                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                            <Text as="h3" className="dark:text-foreground py-2">
                                Welcome, {userName}, to the Expense Report Dashboard
                            </Text>
                        </div>
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
    );
}