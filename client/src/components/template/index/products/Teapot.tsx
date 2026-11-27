import { motion, useReducedMotion } from "framer-motion"

const cycle = { duration: 4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" as const }

export default function TeaPour() {
    const reduce = useReducedMotion()

    return (
        <svg viewBox="0 0 104 74" aria-hidden="true"
            className="h-12 w-16 shrink-0 text-[var(--lamp)] sm:h-16 sm:w-24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.g
                style={{ transformBox: "view-box", transformOrigin: "40px 31px" }}
                animate={reduce ? undefined : { rotate: [0, 0, 26, 26, 0] }}
                transition={{ ...cycle, times: [0, 0.2, 0.42, 0.74, 1] }}
            >
                <path d="M24 25h32v13a10 10 0 0 1-10 10H34a10 10 0 0 1-10-10Z" fill="currentColor" fillOpacity=".14" />
                <path d="M24 28h-5a7 7 0 0 0 0 14h5M56 29l17-3-2 6-15 8M29 25a11 6 0 0 1 22 0M40 19v-3" />
            </motion.g>
            {!reduce && (
                <motion.path d="M72 41c3 5 4 9 4 15" strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 0, 1, 1, 1, 1], opacity: [0, 0, 1, 1, 0, 0] }}
                    transition={{ ...cycle, times: [0, 0.42, 0.52, 0.7, 0.74, 1] }}
                />
            )}
            <path d="M65 56h22v4a7 7 0 0 1-7 7h-8a7 7 0 0 1-7-7Zm22 2h3a3 3 0 0 1 0 6h-4M63 70h26" fill="currentColor" fillOpacity=".14" />
        </svg>
    )
}
