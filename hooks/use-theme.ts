"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    
    // Apply theme using CSS :root and .dark classes
    const root = document.documentElement;
    if (initialTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Update theme using CSS :root and .dark classes
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setLightMode = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
    // Remove dark class to use :root CSS variables
    document.documentElement.classList.remove("dark");
  };

  const setDarkMode = () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
    // Add dark class to use .dark CSS variables
    document.documentElement.classList.add("dark");
  };

  return {
    theme,
    toggleTheme,
    setLightMode,
    setDarkMode,
    mounted,
  };
}