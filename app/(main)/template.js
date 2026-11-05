"use client"
import { motion, useReducedMotion } from "framer-motion"

/* Re-mounts on every navigation: a short fade and rise for each new page */
export default function Template({ children }) {
    const reduce = useReducedMotion()
    return (
        <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    )
}
