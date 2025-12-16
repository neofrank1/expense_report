import React from 'react';

export function AppContent({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex h-full w-full flex-1 flex-col gap-4 bg-background text-foreground font-sans p-4 overflow-auto">
            {children}
        </main>
    );
}