"use client"
import { useEffect, useState, type ReactNode } from "react"

export default function StickyHeader({ children }: { children: ReactNode }) {
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 12)
        on()
        window.addEventListener("scroll", on, { passive: true })
        return () => window.removeEventListener("scroll", on)
    }, [])
    return (
        <header className={`awning sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "shadow-[0_10px_24px_-16px_rgba(10,20,50,0.6)]" : ""}`}>
            <div className={`container flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "h-[54px]" : "h-[70px]"}`}>
                {children}
            </div>
        </header>
    )
}
