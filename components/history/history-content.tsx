'use client';

import { Text } from "../retroui/Text";
import { Button } from "../retroui/Button";
import { Loader } from "../retroui/Loader";
import { Menu, X } from "lucide-react";
import { useDashboardLayout } from "../dashboard/dashboard-layout";
import { HistoryTableComponent, SearchFiltersComponent } from "./history-component";
import { useState, useEffect } from "react";
import { ExpenseBySearchParams } from "@/types/expense.types";
import { getExpensesBySearchParams } from "@/actions/expense-actions";

export function HistoryContent({ expenseCategories, expensesTable }: { expenseCategories: { categories: any[] }, expensesTable: { expenses: ExpenseBySearchParams[] } }) {
    const { isSidebarOpen, toggleSidebar } = useDashboardLayout();
    const [expenses, setExpenses] = useState<ExpenseBySearchParams[]>(expensesTable.expenses);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataObject = Object.fromEntries(formData) as { [key: string]: string };
        setIsLoading(true);
        
        try {
            const searchParams = {
                expense_name: formDataObject.expense_name || undefined,
                expense_amount: formDataObject.expense_amount || undefined,
                expense_date: formDataObject.expense_date || undefined,
                expense_category: formDataObject.category || undefined,
            };
            
            const results = await getExpensesBySearchParams(searchParams);
            setExpenses(results);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            const results = await getExpensesBySearchParams();
            setExpenses(results);
        }, 1000);
        return () => clearInterval(interval);
    }, [expenses]);

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" aria-label="Toggle sidebar" className="dark:bg-foreground dark:text-background" onClick={toggleSidebar}>
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <Text as="h2" className="dark:text-foreground">Expense History</Text>
                </div>
            </div>
            <div className="mt-4">
                <Text as='p'>
                    Search Filters:
                </Text>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mt-4 grid lg:grid-flow-col md:grid-flow-col sm:grid-flow-col grid-rows gap-4">
                    <SearchFiltersComponent expenseCategories={expenseCategories} />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button className="dark:bg-foreground dark:text-background">
                        Search
                    </Button>
                </div>
            </form>
            <div className="w-full">
                {isLoading ? 
                    <div className="w-full h-[500px] flex justify-center items-center">
                       <div className="flex items-center gap-2">
                           <Text as="h2" className="dark:text-foreground">Loading</Text>
                           <Loader size="md" className="mt-5"/>
                       </div>
                    </div>
                : expenses.length === 0 ? (
                    <div className="w-full h-[500px] flex justify-center items-center">
                        <Text as="h2" className="dark:text-foreground">No expenses found</Text>
                    </div>
                ) : (
                    <HistoryTableComponent expenses={expenses} expenseCategories={expenseCategories}/>
                )}
            </div>
        </>
    )
}