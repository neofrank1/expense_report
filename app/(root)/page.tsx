import { AppLayout } from "@/components/layout/app-layout";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Text } from "@/components/retroui/Text";
import Image from "next/image";
import { Button } from "@/components/retroui/Button";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <AppLayout>
        <main className="p-4 flex flex-col items-center justify-center h-screen">
          <div className="w-full h-full relative flex items-center justify-center">
            <Image src="/Banner-1.png" alt="Expense Report" width={1200} height={500} className="object-cover blur-[3px] rounded-full drop-shadow-xl/20" />
            <div className="absolute -top-40 left-0 w-full h-full flex flex-col items-center justify-center">
              <Text as="h1" className="text-xl font-semibold mb-4 dark:text-black">Welcome to the Expense Report App</Text>
              <Text as="p" className="dark:text-black">
               Start to track your expenses now! It's free and easy to use. Paperless and secure.
              </Text>
              <div className="absolute top-30 left-0 w-full h-full flex flex-col items-center justify-center">
                <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-secondary dark:hover:shadow-sm">
                  <Link href="/sign-in">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </AppLayout>
    </div>
  );
}