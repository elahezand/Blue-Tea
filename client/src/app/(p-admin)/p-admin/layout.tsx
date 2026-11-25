import Header from "@/components/modules/p-admin/header";
import Sidebar from "@/components/modules/p-admin/sidebar";
import type { ReactNode } from "react";
import AuthGuard from "@/components/modules/auth/authGuard";
export const metadata = { title: { default: "Admin", template: "%s | Blue Tea admin" }, robots: { index: false, follow: false } }

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
    const content = (
        <div className="flex min-h-dvh">
            <input
                type="checkbox"
                id="hamburger"
                className="peer hidden"
            />
            <label htmlFor="hamburger" aria-label="Toggle menu"
                className="fixed top-3 z-[1001] flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-white/25 bg-[var(--navy)] shadow-md transition-all duration-300 hover:brightness-125 max-lg:left-3 max-lg:peer-checked:left-[206px] lg:left-[206px] lg:peer-checked:left-3">
                <span className="relative block h-[2px] w-[18px] rounded bg-[var(--cream)] before:absolute before:-top-[6px] before:left-0 before:h-[2px] before:w-full before:rounded before:bg-[var(--cream)] after:absolute after:top-[6px] after:left-0 after:h-[2px] after:w-full after:rounded after:bg-[var(--cream)]" />
            </label>
            <div className="z-[1000] w-[260px] shrink-0 bg-[var(--navy)] transition-[margin,translate] duration-300 ease-in-out max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:-translate-x-full max-lg:peer-checked:translate-x-0 lg:peer-checked:-ml-[260px]">
                <div className="h-dvh overflow-y-auto px-4 pt-12 text-[var(--cream)] lg:sticky lg:top-0">
                    <Sidebar />
                </div>
            </div>
            <div className="min-w-0 flex-1 px-4 py-2 sm:px-10 lg:peer-checked:[&_.ptitle]:ps-12 max-lg:[&_.ptitle]:ps-12 max-lg:peer-checked:[&_.ptitle]:ps-0">
                <Header />
                <main id="main" className="w-full sm:px-3">
                    {children}
                </main>
            </div>
        </div>
    );


    return <AuthGuard role="ADMIN">{content}</AuthGuard>;
}
