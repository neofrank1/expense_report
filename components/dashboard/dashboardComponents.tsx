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
import { Expense, ExpenseCategoryData, TotalExpensesByMonth } from "@/types/expense.types";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/contexts/currency-context";

export function TotalSpendingsDashboard({
    className, 
    data,
    renderItem 
}: { 
    className?: string;
    data: any[] | number;
    renderItem?: (item: any, index: number) => React.ReactNode;
}) {
    const { formatCurrency } = useCurrency();
    
    // Convert data to array: if number, create array of that length, if array use it directly
    const itemsArray = Array.isArray(data) 
        ? data 
        : Array.from({ length: data as number });

    const defaultRenderItem = (item: any, index: number) => (
        <Card className="w-full">
            <Card.Content className="flex aspect-video items-center justify-center p-10">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-xl text-muted-foreground mb-2">
                        {item.category_name}
                    </span>
                    <span className="text-3xl font-semibold">
                        {formatCurrency(item.total_amount)}
                    </span>
                </div>
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
                amount: parseFloat(expense.amount as string), // Ensure integer for database
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
                                <Input type="number" name="amount" placeholder="Expense Amount" step="0.01" className="dark:text-slate-900 dark:bg-white"/>
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

export function TotalSpendingsPieChart({className, data}: {className: string, data: ExpenseCategoryData[]}) {
    const { formatCurrency } = useCurrency();
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
            valueFormatter={(value: number) => formatCurrency(value)}
        />
    );
}
 
export function TotalSpendingsPerDayAreaChart({ className, data }: { className: string, data: TotalExpensesByMonth[]}) {
    const { formatCurrency } = useCurrency();
    const [chartData, setChartData] = useState<{ month: string; total_amount: number }[]>([]);

    useEffect(() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // 1-12

        // Create a map of existing data by month
        const dataMap = new Map<number, number>();

        data.forEach((item) => {
            const itemYear = Number(item.year);
            const itemMonth = Number(item.month_number);
            const itemAmount = Number(item.total_amount) || 0;
            
            if (itemYear === currentYear) {
                dataMap.set(itemMonth, itemAmount);
            }
        });

        // Generate array from January to current month
        const processedData: { month: string; total_amount: number }[] = [];
        for (let month = 1; month <= currentMonth; month++) {
            const total = dataMap.get(month) || 0;
            processedData.push({
                month: monthNames[month - 1],
                total_amount: total
            });
        }
        setChartData(processedData);
    }, [data]);

    return (
        <AreaChart
            data={chartData}
            index="month"
            categories={["total_amount"]}
            className={className || ""}
            valueFormatter={(value: number) => formatCurrency(value)}
        />
    )
}
