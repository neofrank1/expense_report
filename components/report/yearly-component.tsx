'use client'

import { BarChart } from "../retroui/charts/BarChart";
import { Text } from "../retroui/Text";
import { Card } from "../retroui/Card";
import type { TopCategoryYearly } from "@/types/expense.types";
import { useCurrency } from "@/contexts/currency-context";

export function YearlyCards({ topCategory }: { topCategory: TopCategoryYearly[] }) {
    const categories = Array.isArray(topCategory) ? topCategory : [];
    const { formatCurrency } = useCurrency();
    console.log(categories);

    return (
        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground">Total Expenses</Text>
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground">Top Category</Text>
                    <div className="flex flex-row justify-between mt-2">
                        <div>
                            {categories[0]['category_name']}
                        </div>
                        <div>
                            {formatCurrency(categories[0]['total_amount'])}
                        </div>
                    </div>
                    
                </Card.Content>
            </Card>
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground">Top Month Spend</Text>
                </Card.Content>
            </Card>
        </div>
    )
}

export function YearlyBarChart() {
    const data = [
        { name: 'Jan', orders: 12 }, 
        { name: 'Feb', orders: 32 }, 
        { name: 'Mar', orders: 19 }, 
        { name: 'Apr', orders: 35 }, 
        { name: 'May', orders: 40 }, 
        { name: 'Jun', orders: 25 },
        { name: 'Jul', orders: 25 },
        { name: 'Aug', orders: 25 },
        { name: 'Sept', orders: 25 },
        { name: 'Oct', orders: 25 },
        { name: 'Nov', orders: 25 },
        { name: 'Dec', orders: 25 },
    ];

    return (
        <div className="mt-8 w-full grid grid-rows-1">
            <Card>
                <Card.Content>
                    <Text as="h4" className="dark:text-foreground mb-4">Monthly Expenses</Text>
                    <BarChart
                        data={data}
                        index="name"
                        categories={["orders"]}
                    />
                </Card.Content>
            </Card>
        </div>
    )
}
