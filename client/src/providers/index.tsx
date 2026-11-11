"use client";
import type { ReactNode } from "react";
import ThemeProvider from "./themeProvider";
import QueryProvider from "./queryProvider";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
        </ThemeProvider>
    );
}
