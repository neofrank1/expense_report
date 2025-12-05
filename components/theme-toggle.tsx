"use client";

import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/retroui/Button";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 hover:bg-primary-hover hover:shadow-sm transition-colors dark:bg-foreground dark:text-background dark:shadow-md dark:hover:shadow-sm dark:shadow-primary"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
