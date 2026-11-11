"use client"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md"
import useTheme from "@/hooks/useTheme"

type Phase = "idle" | "closing" | "hold" | "opening"

const CLOSE = 320, HOLD = 120, OPEN = 340

function Doors({ phase }: { phase: Phase }) {
    const shut = phase === "closing" || phase === "hold"
    const panel = (side: "l" | "r") => ({
        animation: `door-${side}-${shut ? "close" : "open"} ${shut ? CLOSE : OPEN}ms cubic-bezier(.65,0,.35,1) forwards`,
    })
    const cls = "absolute inset-y-0 w-1/2 bg-[#14295a]"
    return (
        <div aria-hidden className="pointer-events-auto fixed inset-0 z-[300] overflow-hidden" style={{ cursor: "progress" }}>
            <style>{`@keyframes door-l-close{from{transform:translateX(-101%)}to{transform:translateX(0)}}@keyframes door-l-open{from{transform:translateX(0)}to{transform:translateX(-101%)}}@keyframes door-r-close{from{transform:translateX(101%)}to{transform:translateX(0)}}@keyframes door-r-open{from{transform:translateX(0)}to{transform:translateX(101%)}}`}</style>
            <div className={`${cls} left-0`} style={panel("l")}>
                <div className="absolute inset-y-0 right-0 w-px bg-white/15" />
                <div className="absolute right-5 top-1/2 h-24 w-1.5 -translate-y-1/2 rounded-full bg-[#f6efe2]/80" />
            </div>
            <div className={`${cls} right-0`} style={panel("r")}>
                <div className="absolute inset-y-0 left-0 w-px bg-white/15" />
                <div className="absolute left-5 top-1/2 h-24 w-1.5 -translate-y-1/2 rounded-full bg-[#f6efe2]/80" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-52"
                style={{ opacity: phase === "hold" ? 1 : 0, transition: "opacity 220ms ease" }}>
                <svg width="76" height="76" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill="#fff" />
                    <path className="loader-steam" d="M19 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" />
                    <path className="loader-steam loader-steam-2" d="M28 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M13 26h22v1.5A11 11 0 0 1 24 38.5 11 11 0 0 1 13 27.5V26Z" fill="#14295a" />
                    <path d="M35 28.5h1.5a3 3 0 0 1 0 6H33" stroke="#14295a" strokeWidth="2" strokeLinecap="round" />
                    <rect x="15" y="40.5" width="18" height="2" rx="1" fill="#14295a" opacity=".85" />
                </svg>
                <span className="script text-3xl text-[#f0c27a]">Just a moment</span>
            </div>
        </div>
    )
}

export default function ThemeToggle({ onPage = false }: { onPage?: boolean }) {
    const { theme, setTheme: apply } = useTheme()
    const [phase, setPhase] = useState<Phase>("idle")
    const timers = useRef<ReturnType<typeof setTimeout>[]>([])

    useEffect(() => {
        const list = timers.current
        return () => list.forEach(clearTimeout)
    }, [])

    const toggle = () => {
        if (phase !== "idle") return
        const next = theme === "dark" ? "light" : "dark"
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduce) return apply(next)
        setPhase("closing")
        timers.current.push(setTimeout(() => { apply(next); setPhase("hold") }, CLOSE + 40))
        timers.current.push(setTimeout(() => setPhase("opening"), CLOSE + 40 + HOLD))
        timers.current.push(setTimeout(() => setPhase("idle"), CLOSE + 40 + HOLD + OPEN + 40))
    }

    return (
        <>
            <button
                type="button"
                onClick={toggle}
                aria-label="Toggle theme"
                className={`flex size-9 cursor-pointer items-center justify-center rounded-full border border-solid bg-transparent transition-colors ${onPage ? "border-line text-fg hover:bg-soft" : "border-white/30 text-[var(--cream)] hover:bg-white/10"}`}>
                {theme === "dark" ? <MdOutlineLightMode size={18} /> : <MdOutlineDarkMode size={18} />}
            </button>
            {phase !== "idle" && typeof document !== "undefined" && createPortal(<Doors phase={phase} />, document.body)}
        </>
    )
}
