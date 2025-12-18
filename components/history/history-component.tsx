'use client';

import { Label } from "../retroui/Label";
import { Input } from "../retroui/Input";
import { Select } from "../retroui/Select";
import { Button } from "../retroui/Button";
import { Table } from "../retroui/Table";
import { Badge } from "../retroui/Badge";
import { ExpenseBySearchParams } from "@/types/expense.types";
import { Pencil, Trash } from "lucide-react";

export function SearchFiltersComponent({ expenseCategories }: { expenseCategories: { categories: any[] } }) {
    return (
        <>
            <div className="gap-2 flex flex-col">
                <Label htmlFor="expense_name">
                    Expense Name
                </Label>
                <Input type="text" placeholder="Expense Name" name="expense_name" className="dark:text-slate-900 dark:bg-white" />
            </div>
            <div className="gap-2 flex flex-col">
                <Label htmlFor="expense_amount">
                    Expense Amount
                </Label>
                <Input type="number" placeholder="Expense Amount" name="expense_amount" className="dark:text-slate-900 dark:bg-white" />
            </div>
            <div className="gap-2 flex flex-col">
                <Label htmlFor="expense_date">
                    Expense Date
                </Label>
                <Input type="date" placeholder="Expense Date" name="expense_date" className="dark:text-slate-900 dark:bg-white" />
            </div>
            <div className="gap-2 flex flex-col">
                <Label htmlFor="category">
                    Category
                </Label>
                <Select name="category">
                    <Select.Trigger className="dark:text-slate-900 dark:bg-white dark:border-slate-900 w-full h-full">
                        <Select.Value placeholder="Pick a Category" />
                    </Select.Trigger>
                    <Select.Content className="dark:bg-white dark:text-slate-900">
                        <Select.Group>
                            <Select.Item value="all">All</Select.Item>
                            {expenseCategories.categories.map((category) => (
                                <Select.Item key={category.id} value={String(category.id)}>{category.name}</Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Content>
                </Select>
            </div>
        </>
    )
}

export function HistoryTableComponent({ expenses }: { expenses: ExpenseBySearchParams[] }) {
    return (
        <>
            <div className="max-h-[500px] border-2 mt-5 overflow-y-auto">
                <Table className="border-0 shadow-none">
                    <Table.Header className="sticky top-0">
                    <Table.Row className="bg-secondary hover:bg-secondary txt">
                        <Table.Head className="w-[100px] text-secondary-foreground text-center">
                        ID
                        </Table.Head>
                        <Table.Head className="text-secondary-foreground text-center">Date</Table.Head>
                        <Table.Head className="text-secondary-foreground text-center">
                        Expense Name
                        </Table.Head>
                        <Table.Head className="text-secondary-foreground text-center">
                            Description
                        </Table.Head>
                        <Table.Head className="text-secondary-foreground text-center">
                        Expense Category
                        </Table.Head>
                        <Table.Head className="text-secondary-foreground text-center">
                        Amount
                        </Table.Head>
                        <Table.Head className="text-secondary-foreground text-center">
                            Actions
                        </Table.Head>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body className="text-center">
                        {expenses.map((expense) => (
                            <Table.Row key={expense.id}>
                                <Table.Cell>{expense.id}</Table.Cell>
                                <Table.Cell>{expense.date.toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{expense.name}</Table.Cell>
                                <Table.Cell>
                                    {expense.description}
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge variant="surface">{expense.category_name}</Badge>
                                </Table.Cell>
                                <Table.Cell>{expense.amount}</Table.Cell>
                                <Table.Cell className="flex items-center gap-2 justify-center">
                                    <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm" size="icon">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm" size="icon">
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </>
    )
}