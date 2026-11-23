"use client"

import { useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { LuSnowflake } from "react-icons/lu"

const SNOWFLAKES = Array.from({ length: 95 }, (_, index) => {
    const duration = 5 + (index * 17 % 90) / 10

    return {
        left: `${(index * 137.508) % 100}%`,
        "--flake-size": `${2 + (index * 31 % 85) / 10}px`,
        "--flake-drift": `${(index * 29 % 161) - 80}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${-duration * (index * 0.618 % 1)}s`,
    } as CSSProperties
})

export default function ChristmasToggle() {
    const [snowing, setSnowing] = useState(false)

    return (
        <>
            <button
                type="button"
                aria-label="Christmas snow"
                aria-pressed={snowing}
                title="Christmas snow"
                onClick={() => setSnowing((active) => !active)}
                className="christmas-toggle flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-white/30 bg-transparent text-[var(--cream)] transition-colors hover:bg-white/10 aria-pressed:border-[var(--lamp)] aria-pressed:text-[var(--lamp)]"
            >
                <LuSnowflake size={18} aria-hidden />
            </button>
            {snowing && createPortal(
                <div aria-hidden className="christmas-flurries">
                    {SNOWFLAKES.map((style, index) => <span key={index} style={style} />)}
                </div>,
                document.body
            )}
        </>
    )
}
