'use client'

import { useDashboardLayout } from "../dashboard/dashboard-layout";
import { Text } from "../retroui/Text";
import { Button } from "../retroui/Button";
import { Menu, X } from "lucide-react";
import { Select } from "../retroui/Select";
import { useRouter, useSearchParams } from "next/navigation";
import { YearlyBarChart, YearlyCards } from "./yearly-component";
import type { TopCategoryYearly, TotalExpensesYearly, TopMonthSpendYearly } from "@/types/expense.types";

export function YearlyContent({ startYear, topCategoryYearly, totalExpenses, topMonthSpend, monthlyExpenses }: { startYear: number, topCategoryYearly: TopCategoryYearly[], totalExpenses: TotalExpensesYearly[], topMonthSpend: TopMonthSpendYearly[], monthlyExpenses: TopMonthSpendYearly[] }) {
    const { isSidebarOpen, toggleSidebar } = useDashboardLayout();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Generate years from startYear to current year
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    
    const start = Math.min(startYear ?? currentYear, currentYear);

    for (let year = start; year <= currentYear; year++) {
        years.push(year);
    }
    const categories = Array.isArray(topCategoryYearly) ? topCategoryYearly : [];
    
    // Get selected year from URL or default to current year
    const yearParam = searchParams.get('year');
    const yearNumber = parseInt(yearParam || '0');
    const selectedYear = !isNaN(yearNumber) && yearNumber > 0 ? yearNumber : currentYear;
    
    const handleYearChange = (value: string) => {
        const year = parseInt(value);
        if (!isNaN(year)) {
            router.push(`/yearly-report?year=${year}`);
        }
    }
    
    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" aria-label="Toggle sidebar" className="dark:bg-foreground dark:text-background" onClick={toggleSidebar}>
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <Text as="h2" className="dark:text-foreground">Yearly Report</Text>
                </div>
                <div>
                    <Select name="year" value={selectedYear.toString()} onValueChange={handleYearChange}>
                        <Select.Trigger className="dark:text-slate-900 dark:bg-white dark:border-slate-900 w-full h-full">
                            <Select.Value placeholder="Pick a Year" />
                        </Select.Trigger>
                        <Select.Content className="dark:bg-white dark:text-slate-900">
                            <Select.Group>
                                {years.map((year) => (
                                    <Select.Item key={year} value={year.toString()}>
                                        {year}
                                    </Select.Item>
                                ))}
                            </Select.Group>
                        </Select.Content>
                    </Select>
                </div>
            </div>
            <div className="mt-4 w-full">
                <Text as="h3" className="dark:text-foreground">The Top of Tops</Text>
                <YearlyCards topCategory={categories} totalExpenses={totalExpenses} topMonthSpend={topMonthSpend} />
                <YearlyBarChart monthlyExpenses={monthlyExpenses} />
            </div>
        </>
    )
}