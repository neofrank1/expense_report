import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./(root)/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/contexts/currency-context";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from '@clerk/themes';

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});
 
const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});
 
export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses effortlessly",
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: 'bottom',
          termsPageUrl: 'https://clerk.com/terms',
        },
        signIn: { theme: neobrutalism },
        signUp: { theme: neobrutalism },
      }}
    >
      <html lang="en">
        <body
          className={`${archivoBlack.variable} ${space.variable}`}
        >
          <ThemeProvider>
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}