"use client"
import { motion, useScroll, useSpring } from "framer-motion"

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })
    return <motion.div aria-hidden style={{ scaleX }} className="absolute inset-x-0 bottom-[-1px] h-[3px] origin-left bg-[var(--green)]" />
}
