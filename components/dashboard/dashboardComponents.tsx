'use client';

import { useEffect, useState } from "react";
import { Carousel } from "@/components/retroui/Carousel";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Plus } from "lucide-react";
import { Text } from "@/components/retroui/Text";
import { Dialog } from "@/components/retroui/Dialog";
import { Input } from "@/components/retroui/Input";
import { Select } from "@/components/retroui/Select";
import { Label } from "@/components/retroui/Label";
import { PieChart } from "@/components/retroui/charts/PieChart";
import { AreaChart } from "@/components/retroui/charts/AreaChart";
import { insertExpense } from "@/actions/expense-actions";
import { useUser } from "@clerk/nextjs";
import { Expense } from "@/types/expense.types";
import { useRouter } from "next/navigation";

export function TotalSpendingsDashboard({
    className, 
    data,
    renderItem 
}: { 
    className?: string;
    data: any[] | number;
    renderItem?: (item: any, index: number) => React.ReactNode;
}) {
    // Convert data to array: if number, create array of that length, if array use it directly
    const itemsArray = Array.isArray(data) 
        ? data 
        : Array.from({ length: data as number });

    const defaultRenderItem = (item: any, index: number) => (
        <Card className="w-full">
            <Card.Content className="flex aspect-video items-center justify-center p-12">
                <span className="text-6xl font-semibold">
                    {typeof item === 'object' && item !== null ? index + 1 : item ?? index + 1}
                </span>
            </Card.Content>
        </Card>
    );
    
    return (
        <div>
           <Carousel className="w-full">
                <Carousel.Content>
                    {itemsArray.map((item, index) => (
                        <Carousel.Item key={index} className={className}>
                            {renderItem ? renderItem(item, index) : defaultRenderItem(item, index)}
                        </Carousel.Item>
                    ))}
                </Carousel.Content>
            </Carousel>
        </div>
    );
}

export function AddExpenseDashboardButton({ categories }: { categories: { id: number, name: string }[] }) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const expense = Object.fromEntries(formData);
            const expenseData: Expense = {
                name: expense.name as string,
                amount: Math.round(parseFloat(expense.amount as string)), // Ensure integer for database
                date: new Date(expense.date as string),
                category_id: parseInt(expense.category as string),
                description: expense.description as string,
                user_id: user?.id as string,
            };
            await insertExpense(expenseData);
            setOpen(false); // Close dialog after successful submission
            // Refresh the page to get updated data
            router.refresh();
        } catch (error) {
            console.error("Error adding expense:", error);
            alert(`Failed to add expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="dark:bg-foreground dark:text-background dark:shadow-primary">
                    <Plus className="h-5 w-5 my-1" />
                    <Text as="h6">Add Expense</Text>
                </Button>
            </Dialog.Trigger>
            <Dialog.Content size='sm'>
                <form onSubmit={handleSubmit}>
                    <Dialog.Header>Add Expense</Dialog.Header>
                        <div className="grid grid-rows grid-cols-2 gap-4 p-4">
                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="expense_name" className="dark:text-foreground">Expense Name</Label>
                                <Input type="text" name="name" placeholder="Expense Name" className="dark:text-slate-900 dark:bg-white"/>
                            </div>
                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="expense_ammount" className="dark:text-foreground">Expense Amount</Label>
                                <Input type="number" name="amount" placeholder="Expense Amount" className="dark:text-slate-900 dark:bg-white"/>
                            </div>
                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="expense_ammount" className="dark:text-foreground">Expense Date</Label>
                                <Input type="date" name="date" placeholder="Expense Date" className="dark:text-slate-900 dark:bg-white"/>
                            </div>
                            <div className="gap-2 flex flex-col">
                                 <Label htmlFor="category" className="dark:text-foreground">Category</Label>
                                <Select name="category">
                                    <Select.Trigger className="dark:text-slate-900 dark:bg-white dark:border-slate-900 w-full h-full">
                                        <Select.Value placeholder="Pick a Category" />
                                    </Select.Trigger>
                                    <Select.Content className="dark:bg-white dark:text-slate-900">
                                        <Select.Group>
                                            {categories.map((category, index) => (
                                                <Select.Item key={index} value={String(category.id)}>{category.name}</Select.Item>
                                            ))}
                                        </Select.Group>
                                    </Select.Content>
                                </Select>
                            </div>
                            <div className="col-span-2 gap-2 flex flex-col">
                                <Label htmlFor="description" className="dark:text-foreground">Description</Label>
                                <Input type="text" name="description" placeholder="Expense Description" className="dark:text-slate-900 dark:bg-white"/>
                            </div>
                        </div>
                        <Dialog.Footer>
                            <Button type="submit">Add Expense</Button>
                        </Dialog.Footer>
                </form>
            </Dialog.Content>
        </Dialog>
    );
}

type ExpenseCategoryData = {
    category_id: number | null;
    category_name: string;
    total_amount: number | string;
    count: number;
};

export function TotalSpendingsPieChart({className, data}: {className: string, data: ExpenseCategoryData[]}) {
    const [pieChartData, setPieChartData] = useState<{ name: string, value: number }[]>([]);

    useEffect(() => {
        const processedData = data
            .filter((item) => item && item.category_name && (item.total_amount !== null && item.total_amount !== undefined))
            .map((item) => ({
                name: item.category_name || 'Uncategorized',
                value: typeof item.total_amount === 'string' ? parseFloat(item.total_amount) : Number(item.total_amount) || 0,
            }))
            .filter((item) => item.value > 0);
        
        setPieChartData(processedData);
    }, [data]);


    // If no data, show empty state
    if (pieChartData.length === 0) {
        return (
            <div className={className}>
                <div className="flex items-center justify-center h-full">
                    <Text as="p" className="text-muted-foreground">No expense data available</Text>
                </div>
            </div>
        );
    }
    
    return (
        <PieChart
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#FF6342', '#FF3424']}
            className={className}
            showLegend={true}
        />
    );
}

const data = [{ name: 'Jan', orders: 12 }, { name: 'Feb', orders: 32 }, { name: 'Mar', orders: 19 }, { name: 'Apr', orders: 35 }, { name: 'May', orders: 40 }, { name: 'Jun', orders: 25 }];
 
export function TotalSpendingsPerDayAreaChart({ className }: { className: string }) {
    return (
        <AreaChart
            data={data}
            index="name"
            categories={["orders"]}
            className={className || ""}
        />
    )
}
