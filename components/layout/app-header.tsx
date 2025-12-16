"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/retroui/Button";
import Link from "next/link";
import { Text } from "@/components/retroui/Text";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export function AppHeader() {
    const { user } = useUser();

    return (
        <header className="h-16 bg-primary flex items-center justify-between px-4 font-head dark:bg-secondary dark:text-primary dark:shadow-md dark:shadow-primary">
            <h1 className="text-2xl font-bold text-primary-foreground dark:text-foreground">Expense Report</h1>
            <div className="flex flex-row gap-4 ml-auto mr-4">
                <SignedOut>
                    <Link href="/sign-in">
                        <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm">Login</Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm">Register</Button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <div className="hidden md:flex items-center gap-1 py-2">
                        <Text as="h6" className="dark:text-white mr-1">{user?.firstName} {user?.lastName}</Text>
                        <UserButton />
                    </div>
                </SignedIn>
            </div>
            <ThemeToggle />
        </header>
    );
}