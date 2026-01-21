'use client'

import { BarChart } from "../retroui/charts/BarChart";
import { Text } from "../retroui/Text";
import { Card } from "../retroui/Card";
import type { TopCategoryYearly, TotalExpensesYearly, TopMonthSpendYearly } from "@/types/expense.types";
import { useCurrency } from "@/contexts/currency-context";

const getMonthName = (monthNumber: string): string => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = parseInt(monthNumber, 10) - 1;
    return monthNames[monthIndex] || monthNumber;
};

export function YearlyCards({ topCategory, totalExpenses, topMonthSpend }: { topCategory: TopCategoryYearly[], totalExpenses: TotalExpensesYearly[], topMonthSpend: TopMonthSpendYearly[] }) {
    const categories = Array.isArray(topCategory) ? topCategory : [];
    const expenses = Array.isArray(totalExpenses) ? totalExpenses : [];
    const monthSpend = Array.isArray(topMonthSpend) ? topMonthSpend : [];
    const { formatCurrency } = useCurrency();

    return (
        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground">Total Expenses</Text>
                    {expenses.length > 0 ? (
                        <div className="flex flex-row justify-between mt-2">
                            <div>
                                {formatCurrency(expenses[0].total_amount)}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 text-muted-foreground">No data available</div>
                    )}
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground">Top Category</Text>
                    {categories.length > 0 ? (
                        <div className="flex flex-row justify-between mt-2">
                            <div>
                                {categories[0].category_name}
                            </div>
                            <div>
                                {formatCurrency(categories[0].total_amount)}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 text-muted-foreground">No data available</div>
                    )}
                    
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground">Top Month Spend</Text>
                    {monthSpend.length > 0 ? (
                       <div className="flex flex-col justify-between mt-2">
                            {monthSpend.map((month) => (
                                <div key={month.month} className="flex flex-row justify-between">
                                    <div>
                                        {getMonthName(month.month.split('-')[1])}
                                    </div>
                                    <div>
                                        {formatCurrency(month.total_amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-2 text-muted-foreground">No data available</div>
                    )}
                </Card.Content>
            </Card>
        </div>
    )
}

export function YearlyBarChart({ monthlyExpenses }: { monthlyExpenses: TopMonthSpendYearly[] }) {
    const expensesData = Array.isArray(monthlyExpenses) ? monthlyExpenses : [];
    
    // Create a map of month to total_amount for quick lookup
    const expensesMap = new Map<string, number>();
    expensesData.forEach((expense) => {
        const monthNum = expense.month.split('-')[1]; // Extract month number (01-12)
        const amount = typeof expense.total_amount === 'string' 
            ? parseFloat(expense.total_amount) 
            : expense.total_amount;
        expensesMap.set(monthNum, amount || 0);
    });

    // Generate all 12 months with short names
    const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create data array with all 12 months
    const data = monthShortNames.map((month, index) => {
        const monthNum = String(index + 1).padStart(2, '0'); // 01, 02, ..., 12
        const totalAmount = expensesMap.get(monthNum) || 0;
        
        return {
            month,
            total_amount: totalAmount
        };
    });

    return (
        <div className="mt-8 w-full grid grid-rows-1">
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground mb-4">Monthly Expenses</Text>
                    {data.length > 0 ? (
                        <BarChart
                            data={data}
                            index="month"
                            categories={["total_amount"]}
                        />
                    ) : (
                        <div className="mt-2 text-muted-foreground">No data available</div>
                    )}
                </Card.Content>
            </Card>
        </div>
    )
}