import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AppLayout } from "@/components/layout/app-layout";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { YearlyContent } from "@/components/report/yearly-content";
import { getExpensesByYear, getUserYearData, getTopCategoryYearly } from "@/actions/expense-actions";

export default async function ExpenseYearlyPage({
    searchParams,
}: {
    searchParams: Promise<{ year?: string }>;
}) {
    const { year } = await searchParams;

    const yearNumber = parseInt(year || '0');

    const user = await currentUser();
    if (!user) {
        redirect("/");
    }

    const currentYear = new Date().getFullYear();
    const selectedYear = !isNaN(yearNumber) && yearNumber > 0 ? yearNumber : currentYear;

    const userYearData = await getUserYearData(selectedYear);
    const data = await getExpensesByYear(selectedYear);
    const topCategory = await getTopCategoryYearly(selectedYear);

    return (
        <AppLayout>
            <DashboardLayout>
                <YearlyContent startYear={userYearData.startYear} topCategoryYearly={topCategory} />
            </DashboardLayout>
        </AppLayout>
    )
}