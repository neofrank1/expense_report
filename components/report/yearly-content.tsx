'use client'

import { useDashboardLayout } from "../dashboard/dashboard-layout";
import { Text } from "../retroui/Text";
import { Button } from "../retroui/Button";
import { Menu, X } from "lucide-react";
import { BarChart } from "../retroui/charts/BarChart";

export function YearlyContent() {
     const { isSidebarOpen, toggleSidebar } = useDashboardLayout();

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" aria-label="Toggle sidebar" className="dark:bg-foreground dark:text-background" onClick={toggleSidebar}>
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <Text as="h2" className="dark:text-foreground">Yearly Report</Text>
                </div>
            </div>
        </>
    )
}
