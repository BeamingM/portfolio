"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "system" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 1. Check saved user preference, fallback to "system"
    const saved = localStorage.getItem("portfolio_theme") as Theme | null;
    const initialTheme: Theme = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    queueMicrotask(() => {
      setThemeState(initialTheme);
    });

    // 2. Resolve theme based on system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentTheme: Theme) => {
      const isDark = currentTheme === "dark" || (currentTheme === "system" && mediaQuery.matches);
      const effective: "light" | "dark" = isDark ? "dark" : "light";
      queueMicrotask(() => {
        setResolvedTheme(effective);
      });

      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.style.colorScheme = "light";
      }
    };

    applyTheme(initialTheme);

    // 3. Listen to system preference changes dynamically
    const handleSystemChange = () => {
      const current = localStorage.getItem("portfolio_theme") as Theme | null;
      if (!current || current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("portfolio_theme", newTheme);
    } catch {
      // Safe fallback
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const isDark = newTheme === "dark" || (newTheme === "system" && mediaQuery.matches);
    const effective: "light" | "dark" = isDark ? "dark" : "light";
    setResolvedTheme(effective);

    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.colorScheme = "light";
    }
  };

  const toggleTheme = () => {
    // Cycles between light and dark
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
