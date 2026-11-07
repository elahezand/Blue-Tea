"use client";
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";

// "light" | "dark". The first paint is set by themeScript in app/layout.tsx (no flash);
// this provider keeps React in sync with it and saves the user's choice.
export type Theme = "light" | "dark";

export interface ThemeContextValue {
    theme: Theme
    isDark: boolean
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

const readSaved = (): Theme | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return isTheme(saved) ? saved : null;
    } catch { return null; }
};

const systemTheme = (): Theme =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");

    // Read what themeScript already put on <html>
    useEffect(() => {
        const current = document.documentElement.dataset.theme;
        setThemeState(isTheme(current) ? current : readSaved() || systemTheme());
    }, []);

    // Follow the system setting while the user has not picked a theme
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e: MediaQueryListEvent) => {
            if (readSaved()) return;
            const next: Theme = e.matches ? "dark" : "light";
            document.documentElement.dataset.theme = next;
            setThemeState(next);
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem(STORAGE_KEY, next); } catch { }
        setThemeState(next);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, isDark: theme === "dark", setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
