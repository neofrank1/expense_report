'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'PHP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatCurrency: (amount: number | string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
}

const currencySymbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    PHP: '₱',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('USD');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedCurrency = localStorage.getItem('currency') as Currency | null;
        if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'EUR' || savedCurrency === 'PHP')) {
            setCurrencyState(savedCurrency);
        }
    }, []);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        if (typeof window !== 'undefined') {
            localStorage.setItem('currency', newCurrency);
        }
    };

    const formatCurrency = (amount: number | string): string => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return `${currencySymbols[currency]}0.00`;
        
        const formatted = numAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        
        return `${currencySymbols[currency]}${formatted}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}