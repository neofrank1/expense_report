import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AppLayout } from "@/components/layout/app-layout";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { YearlyContent } from "@/components/report/yearly-content";

export default async function ExpenseYearlyPage() {
    const user = await currentUser();
    if (!user) {
        redirect("/");
    }

    return (
        <AppLayout>
            <DashboardLayout>
                <YearlyContent />
            </DashboardLayout>
        </AppLayout>
    )
}