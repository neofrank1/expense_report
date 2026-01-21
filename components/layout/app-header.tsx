"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/retroui/Button";
import Link from "next/link";
import { Text } from "@/components/retroui/Text";
import { UserButton, SignedIn, SignedOut, useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function AppHeader() {
    const { user } = useUser();
    const { isLoaded } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isLoaded) {
        return (
            <header className="h-16 bg-primary flex items-center justify-between px-4 font-head dark:bg-secondary dark:text-primary dark:shadow-md dark:shadow-primary">
                <h1 className="text-2xl font-bold text-primary-foreground dark:text-foreground">Expense Report</h1>
                <div className="flex flex-row gap-4 ml-auto mr-4">
                    <div className="hidden md:flex items-center gap-1 py-2 w-32 h-8" />
                </div>
                <ThemeToggle />
            </header>
        );
    }

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