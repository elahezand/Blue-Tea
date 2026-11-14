import type { ReactNode } from "react"
import Link from "next/link"
import { MdArrowBack } from "react-icons/md"
import ThemeToggle from "@/components/modules/themeToggle"

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-canvas">
            <div className="container flex items-center justify-between py-5">
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-link">
                    <MdArrowBack aria-hidden className="text-lg" />Back to Blue Tea
                </Link>
                <ThemeToggle onPage />
            </div>
            <main id="main" className="flex flex-1 items-center justify-center pb-10">{children}</main>
        </div>
    )
}