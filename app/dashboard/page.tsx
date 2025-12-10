import { AppLayout } from "@/components/layout/app-layout";

export default function DashboardPage() {
  return (
    <div>
        <AppLayout>
            <main className="p-4">
                <h2 className="text-xl font-semibold mb-4 dark:text-foreground">Welcome to the Dashboard</h2>
                <p className="dark:text-foreground">
                This is the home page. Use the navigation above to explore the app.
                </p>
            </main>
        </AppLayout>
    </div>
  );
}