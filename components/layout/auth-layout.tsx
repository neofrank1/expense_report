import { AppContent } from "./app-content"
import React from "react"

export function AuthLayout({children}: {children: React.ReactNode}) {
    return (
    <div className="flex h-screen flex-col">
        <AppContent>
            {children}
        </AppContent>
    </div>
    )
}