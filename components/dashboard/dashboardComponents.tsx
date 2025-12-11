'use client';

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

export function AddExpenseDashboardButton() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const expense = Object.fromEntries(formData);
        console.log(expense);
    }

    return (
        <Dialog>
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
                                <Label htmlFor="expense_name">Expense Name</Label>
                                <Input type="text" name="name" placeholder="Expense Name" className="dark:text-slate-900 dark:bg-white"/>
                            </div>
                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="expense_ammount">Expense Ammoumt</Label>
                                <Input type="number" name="amount" placeholder="Expense Amount" className="dark:text-slate-900 dark:bg-white"/>
                            </div>
                            <div className="gap-2 flex flex-col">
                                <Label htmlFor="expense_ammount">Expense Date</Label>
                                <Input type="date" name="date" placeholder="Expense Date" className="dark:text-slate-900 dark:bg-white"/>
                            </div>
                            <div className="gap-2 flex flex-col">
                                 <Label htmlFor="category">Category</Label>
                                <Select name="category">
                                    <Select.Trigger className="dark:text-slate-900 dark:bg-white w-full">
                                        <Select.Value placeholder="Pick your Pokemon" />
                                    </Select.Trigger>
                                    <Select.Content className="dark:bg-white dark:text-slate-900">
                                        <Select.Group>
                                            <Select.Item value="food">Food</Select.Item>
                                            <Select.Item value="transportation">Transportation</Select.Item>
                                            <Select.Item value="utilities">Utilities</Select.Item>
                                            <Select.Item value="entertainment">Entertainment</Select.Item>
                                            <Select.Item value="other">Other</Select.Item>
                                        </Select.Group>
                                    </Select.Content>
                                </Select>
                            </div>
                            <div className="col-span-2 gap-2 flex flex-col">
                                <Label htmlFor="description">Description</Label>
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

export function TotalSpendingsPieChart() {
    const data = [
        { name: 'Food', value: 400 },
        { name: 'Transportation', value: 300 },
        { name: 'Utilities', value: 300 },
        { name: 'Entertainment', value: 200 },
        { name: 'Other', value: 100 },
    ];
    
    return (
        <PieChart
            data={data}
            dataKey="value"
            nameKey="name"
        />
    );
}