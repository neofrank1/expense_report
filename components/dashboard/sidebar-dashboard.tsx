'use client';

import { Accordion } from "@/components/retroui/Accordion";
import { Card } from "../retroui/Card";
import Link from "next/link";
import { Button } from "../retroui/Button";
import { Separator } from "../ui/separator";

export function SidebarDashboard() {
    return (
        <Card className="p-4 h-full max-w-full min-w-[14vw]">
            <Card.Title>
                Menu
            </Card.Title>
            <Card.Content>
            <div className="grid grid-rows gap-4">
            <Accordion type="single" collapsible className="space-y-4 w-full">
                <Accordion.Item value="item-1">
                    <Accordion.Header>Total Spendings</Accordion.Header>
                    <Accordion.Content>
                        <Link href="/dashboard"><Button variant="link">Dashboard</Button></Link>
                        <Separator />
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-2">
                    <Accordion.Header>Total Spendings by Category</Accordion.Header>
                    <Accordion.Content>
                        This is the content of the second accordion item.
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-3">
                    <Accordion.Header>Total Spendings by Month</Accordion.Header>
                    <Accordion.Content>
                    This is the content of the third accordion item.
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
            </div>
            </Card.Content>
        </Card>
    )
}