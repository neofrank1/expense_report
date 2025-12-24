'use client';

import { Card } from "../retroui/Card";
import Link from "next/link";
import { DashboardMenu } from "@/types/dashboard.types";
import { Euro, Home, DollarSign, PhilippinePeso } from "lucide-react";
import { Text } from "../retroui/Text";
import { Select } from "@/components/retroui/Select";
import { useCurrency } from "@/contexts/currency-context";

const dashboardMenus: DashboardMenu[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: <Home />
    },
    {
        name: "Expense History",
        href: "/history",
        icon: <Home />
    }, 
    {
        name: "Yearly Expense Report",
        href: "/yearly-report",
        icon: <Home />
    }
]

export function SidebarDashboard() {
    const { currency, setCurrency } = useCurrency();

    return (
        <Card className="p-4 h-full max-w-full min-w-[14vw]">
            <Card.Title className="text-center">
                Menu
            </Card.Title>
            <Card.Content className="flex flex-col h-[95%] justify-between">
            <div className="grid grid-rows gap-4 justify-center items-center">
                {dashboardMenus.map((menu, index) => (
                    <Link href={menu.href} key={index}>
                        <span className="flex flex-col items-center justify-start gap-2">
                            <Text as="h6" className="text-center" >{menu.name}</Text>
                        </span>
                    </Link>
                ))}
            </div>
            <div className="mt-auto mb-1">
                <Select name="currency" value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'EUR' | 'PHP')}>
                    <Select.Trigger className="dark:text-slate-900 dark:bg-white dark:border-slate-900 w-full h-full">
                        <Select.Value placeholder="Pick Currency" />
                    </Select.Trigger>
                    <Select.Content className="dark:bg-white dark:text-slate-900">
                        <Select.Group>
                            <Select.Item value="USD">
                                <span className="flex flex-row items-center justify-start gap-2">
                                    <DollarSign />
                                    USD
                                </span>
                            </Select.Item>
                            <Select.Item value="EUR">
                                <span className="flex flex-row items-center justify-start gap-2">
                                    <Euro />
                                    EUR
                                </span>
                            </Select.Item>
                            <Select.Item value="PHP">
                                <span className="flex flex-row items-center justify-start gap-2">
                                    <PhilippinePeso />
                                    PHP
                                </span>
                            </Select.Item>
                        </Select.Group>
                    </Select.Content>
                </Select>
            </div>
            </Card.Content>
        </Card>
    )
}