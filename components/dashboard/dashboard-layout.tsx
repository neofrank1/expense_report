'use client';

import { useState, ReactNode, createContext, useContext } from "react";
import { SidebarDashboard } from "@/components/dashboard/sidebar-dashboard";

interface DashboardLayoutContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | null>(null);

export function useDashboardLayout() {
    const context = useContext(DashboardLayoutContext);
    if (!context) {
        throw new Error("useDashboardLayout must be used within DashboardLayout");
    }
    return context;
}

export function DashboardLayout({
    children
}: {
    children: ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <DashboardLayoutContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            <div className="grid grid-cols-12 gap-4 h-full overflow-hidden">
                {isSidebarOpen && (
                    <div className="col-span-2 p-4 overflow-hidden">
                        <SidebarDashboard />
                    </div>
                )}
                <div className={`p-4 overflow-y-auto ${isSidebarOpen ? 'col-span-10' : 'col-span-12'}`}>
                    {children}
                </div>
            </div>
        </DashboardLayoutContext.Provider>
    );
}