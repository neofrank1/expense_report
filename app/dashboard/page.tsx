import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { TotalSpendingsDashboard } from "@/components/dashboard/dashboardComponents";
import { AddExpenseDashboardButton } from "@/components/dashboard/dashboardComponents";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TotalSpendingsPieChart } from "@/components/dashboard/dashboardComponents";

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect("/");
    }
    
    return (
        <AppLayout>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 p-4">
                    <Card className="p-4 h-full min-h-[80vh] max-h-full max-w-full min-w-[14vw]">
                        <Card.Title>
                            Menu
                        </Card.Title>
                        <Card.Content>
                            <p>
                                This is a test card.
                            </p>
                        </Card.Content>
                    </Card>
                </div>
                <div className="col-span-10 p-4">
                    <div className="grid gap-4">
                        <div className="flex flex-row justify-between items-center">
                            <Text as="h3" className="dark:text-foreground py-2">
                                Welcome, {user?.fullName}, to the Expense Report Dashboard
                            </Text>
                            <AddExpenseDashboardButton />
                        </div>
                        <div>
                            <Text as="h3" className="mt-4">Total Spendings by Category</Text>
                        </div>
                        <div className="mt-2">
                            <TotalSpendingsDashboard 
                                className="basis-1/4 p-4"
                                data={[1, 2, 3, 4, 5]}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mt-4 ">
                        <div className="col-span-2">
                            <Text as='h3'>Total Spendings</Text>
                            <Card className="mt-2 w-full min-h-[20vh] max-h-full">
                                <Card.Content>
                                    <TotalSpendingsPieChart />
                                </Card.Content>
                            </Card>
                        </div>
                        <div className="col-span-3">
                            <Text as='h3'>Total Spendings this Month</Text>
                            <Card className="mt-2 w-full min-h-[30vh] max-w-full">
                                <Card.Content>
                                    <Text>This is a card.</Text>
                                </Card.Content>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}