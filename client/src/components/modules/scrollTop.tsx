"use client"
import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { MdKeyboardArrowUp } from "react-icons/md"

/* Round back-to-top button; shows up after the first screen of scrolling. */
export default function ScrollTop() {
    const [show, setShow] = useState(false)
    const reduce = useReducedMotion()
    useEffect(() => {
        const on = () => setShow(window.scrollY > 500)
        on()
        window.addEventListener("scroll", on, { passive: true })
        return () => window.removeEventListener("scroll", on)
    }, [])
    return (
        <AnimatePresence>
            {show && (
                <motion.button type="button" aria-label="Back to top"
                    onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
                    initial={reduce ? false : { opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.8 }} transition={{ duration: 0.25 }}
                    className="fixed right-5 bottom-5 z-40 flex size-11 cursor-pointer items-center justify-center rounded-full border border-solid border-line bg-surface text-2xl text-fg shadow-lg transition-colors hover:border-transparent hover:bg-brown hover:text-white">
                    <MdKeyboardArrowUp />
                </motion.button>
            )}
        </AnimatePresence>
    )
}
