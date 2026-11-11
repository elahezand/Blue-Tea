"use client";
import { createContext, useCallback, useEffect, useSyncExternalStore, type ReactNode } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
    theme: Theme
    isDark: boolean
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";
const THEME_EVENT = "theme-change";

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

const readSaved = (): Theme | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return isTheme(saved) ? saved : null;
    } catch { return null; }
};

const systemTheme = (): Theme =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new Event(THEME_EVENT));
};

const subscribe = (onChange: () => void) => {
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
};

const getSnapshot = (): Theme => {
    const current = document.documentElement.dataset.theme;
    return isTheme(current) ? current : readSaved() || systemTheme();
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light" as Theme);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e: MediaQueryListEvent) => {
            if (!readSaved()) applyTheme(e.matches ? "dark" : "light");
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        try { localStorage.setItem(STORAGE_KEY, next); } catch { }
        applyTheme(next);
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
