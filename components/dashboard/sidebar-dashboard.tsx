'use client';

import { Card } from "../retroui/Card";
import Link from "next/link";
import { Button } from "../retroui/Button";
import { DashboardMenu } from "@/types/dashboard.types";
import { Euro, Home, DollarSign, PhilippinePeso } from "lucide-react";
import { Text } from "../retroui/Text";
import { Select } from "@/components/retroui/Select";

const dashboardMenus: DashboardMenu[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: <Home />
    },
    {
        name: "Settings",
        href: "/settings",
        icon: <Home />
    }
]

export function SidebarDashboard() {
    return (
        <Card className="p-4 h-full max-w-full min-w-[14vw]">
            <Card.Title className="text-center">
                Menu
            </Card.Title>
            <Card.Content className="flex flex-col h-[95%] justify-between">
            <div className="grid grid-rows gap-4 justify-center items-center">
                {dashboardMenus.map((menu, index) => (
                    <Link href={menu.href} key={index}>
                        <Button variant="link" className="text-center justify-start w-full">
                            <span className="flex flex-row items-center justify-start gap-2">
                                {menu.icon}
                                <Text as="h4" >{menu.name}</Text>
                            </span>
                        </Button>
                    </Link>
                ))}
            </div>
            <div className="mt-auto mb-1">
                <Select name="category">
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