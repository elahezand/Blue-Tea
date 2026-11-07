"use client";
import type { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";
import QueryProvider from "./QueryProvider";

// All app-wide providers in one place; used once in app/layout.tsx
export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
        </ThemeProvider>
    );
}
