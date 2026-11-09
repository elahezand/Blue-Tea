"use client"
import { useEffect, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

let firstLoad = true

export default function Template({ children }: { children: ReactNode }) {
    const reduce = useReducedMotion()
    const animate = !reduce && !firstLoad

    useEffect(() => { firstLoad = false }, [])

    return (
        <motion.div initial={animate ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    )
}