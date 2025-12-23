'use client';

import { useState } from "react";
import { Label } from "../retroui/Label";
import { Input } from "../retroui/Input";
import { Select } from "../retroui/Select";
import { Button } from "../retroui/Button";
import { Table } from "../retroui/Table";
import { Badge } from "../retroui/Badge";
import { ExpenseBySearchParams, ExpenseEditParams } from "@/types/expense.types";
import { Pencil, Trash } from "lucide-react";
import { Dialog } from "../retroui/Dialog";
import { updateExpense, deleteExpense } from "@/actions/expense-actions";
import { Text } from "../retroui/Text";
import { useCurrency } from "@/contexts/currency-context";

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

export function HistoryTableComponent({ expenses, expenseCategories, onRefresh }: { expenses: ExpenseBySearchParams[], expenseCategories: { categories: any[] }, onRefresh?: () => void }) {
    const { formatCurrency } = useCurrency();
    
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
                                <Table.Cell>{formatCurrency(expense.amount)}</Table.Cell>
                                <Table.Cell className="flex items-center gap-2 justify-center">
                                    <EditExpenseDialog expense={expense} expenseCategories={expenseCategories} onRefresh={onRefresh} />
                                    <DeleteExpenseDialog expenseId={expense.id} onRefresh={onRefresh} />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </>
    )
}

export function EditExpenseDialog({ expense, expenseCategories, onRefresh }: { expense: ExpenseBySearchParams, expenseCategories: { categories: any[] }, onRefresh?: () => void }) {
    const [formData, setFormData] = useState({
        name: expense.name,
        amount: String(expense.amount),
        date: expense.date.toISOString().split('T')[0],
        category: String(expense.category_id),
        description: expense.description || ''
    });
    const [isOpen, setIsOpen] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataObject = Object.fromEntries(formData) as { [key: string]: string };
       
        try {
            await updateExpense({
                id: parseInt(formDataObject.id),
                name: formDataObject.name,
                amount: parseInt(formDataObject.amount),
                date: new Date(formDataObject.date),
                category_id: parseInt(formDataObject.category),
                description: formDataObject.description
            } as ExpenseEditParams);
            
            setIsOpen(false);
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error("Error updating expense:", error);
            alert(`Failed to update expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
    return (
       <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm" size="icon">
                    <Pencil className="w-4 h-4" />
                </Button>
            </Dialog.Trigger>
                <Dialog.Content size='sm'>
                    <form onSubmit={handleSubmit}>
                        <Dialog.Header>
                            Edit Expense
                        </Dialog.Header>
                            <div className="grid grid-rows grid-cols-2 gap-4 p-4">
                                <div className="gap-2 flex flex-col">
                                    <input type="hidden" name="id" value={String(expense.id)} />
                                    <Label htmlFor="expense_name" className="dark:text-foreground">Expense Name</Label>
                                    <Input type="text" name="name" placeholder="Expense Name" className="dark:text-slate-900 dark:bg-white" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
                                </div>
                                <div className="gap-2 flex flex-col">
                                    <Label htmlFor="expense_ammount" className="dark:text-foreground">Expense Amount</Label>
                                    <Input type="number" name="amount" placeholder="Expense Amount" className="dark:text-slate-900 dark:bg-white" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}/>
                                </div>
                                <div className="gap-2 flex flex-col">
                                    <Label htmlFor="expense_ammount" className="dark:text-foreground">Expense Date</Label>
                                    <Input type="date" name="date" placeholder="Expense Date" className="dark:text-slate-900 dark:bg-white" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}/>
                                </div>
                                <div className="gap-2 flex flex-col">
                                        <Label htmlFor="category" className="dark:text-foreground">Category</Label>
                                    <Select name="category" value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                        <Select.Trigger className="dark:text-slate-900 dark:bg-white dark:border-slate-900 w-full h-full">
                                            <Select.Value placeholder="Pick a Category" />
                                        </Select.Trigger>
                                        <Select.Content className="dark:bg-white dark:text-slate-900">
                                            <Select.Group>
                                                {expenseCategories.categories.map((category, index) => (
                                                    <Select.Item key={index} value={String(category.id)}>{category.name}</Select.Item>
                                                ))}
                                            </Select.Group>
                                        </Select.Content>
                                    </Select>
                                </div>
                                <div className="col-span-2 gap-2 flex flex-col">
                                    <Label htmlFor="description" className="dark:text-foreground">Description</Label>
                                    <Input type="text" name="description" placeholder="Expense Description" className="dark:text-slate-900 dark:bg-white" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}/>
                                </div>
                            </div>
                            <Dialog.Footer>
                                <Dialog.Trigger asChild>
                                    <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm bg-white text-black" type="button">Cancel</Button>
                                </Dialog.Trigger>
                                <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm" type="submit">Save</Button>
                            </Dialog.Footer>
                    </form>
                </Dialog.Content>
        </Dialog>
       </>
    )
}

export function DeleteExpenseDialog({ expenseId, onRefresh }: { expenseId: number, onRefresh?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await deleteExpense(expenseId);
            setIsOpen(false);
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
            alert(`Failed to delete expense: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Trigger asChild>
                    <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm" size="icon">
                        <Trash className="w-4 h-4" />
                    </Button>
                </Dialog.Trigger>
                <Dialog.Content size='sm'>
                        <Dialog.Header>
                            Delete Expense
                        </Dialog.Header>
                        <div className="flex flex-col gap-2 justify-center items-center p-4">
                            <div className="dark:text-foreground text-center">Are you sure you want to delete this expense?</div>
                            <div className="dark:text-foreground text-center">This action cannot be undone.</div>
                        </div>
                        <Dialog.Footer>
                            <Dialog.Trigger asChild>
                                <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm bg-white text-black" type="button">Cancel</Button>
                            </Dialog.Trigger>
                            <Button className="dark:bg-red-500 dark:text-white dark:shadow-md dark:shadow-dark dark:hover:shadow-sm bg-red-500" size="icon" onClick={handleDelete} type="button">
                                Delete
                            </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog>
        </>
    )
}