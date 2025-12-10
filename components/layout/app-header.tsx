"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/retroui/Button";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function AppHeader() {
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
                    <UserButton />
                </SignedIn>
            </div>
            <ThemeToggle />
        </header>
    );
}