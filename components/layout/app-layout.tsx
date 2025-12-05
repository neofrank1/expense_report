import React from 'react';
import { AppContent } from './app-content';
import { AppHeader} from '@/components/layout/app-header';

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
        <AppHeader/>
        <AppContent>
            {children}
        </AppContent>
        </div>

    );
}