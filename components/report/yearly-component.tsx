'use client'

import { BarChart } from "../retroui/charts/BarChart";
import { Text } from "../retroui/Text";
import { Card } from "../retroui/Card";

export function YearlyCards() {
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
