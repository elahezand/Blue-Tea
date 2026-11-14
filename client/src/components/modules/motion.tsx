"use client"
import type { FormEventHandler, ReactNode, Ref } from "react"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

type MotionTag = "div" | "section" | "article" | "ul" | "ol" | "li" | "p" | "span" | "header" | "footer" | "figure" | "form" | "h1" | "h2" | "h3"
const TAGS = {
    div: motion.div, section: motion.section, article: motion.article, ul: motion.ul, ol: motion.ol, li: motion.li, p: motion.p, span: motion.span,
    header: motion.header, footer: motion.footer, figure: motion.figure, form: motion.form, h1: motion.h1, h2: motion.h2, h3: motion.h3,
} as unknown as Record<MotionTag, typeof motion.div>

type MotionBoxProps = Omit<HTMLMotionProps<"div">, "children" | "ref" | "onSubmit"> & {
    children?: ReactNode
    className?: string
    as?: MotionTag
    ref?: Ref<HTMLFormElement> | Ref<HTMLElement>
    onSubmit?: FormEventHandler<HTMLFormElement>
    action?: string | ((formData: FormData) => void | Promise<void>)
}

const asDivProps = (rest: object) => rest as HTMLMotionProps<"div">

export function Reveal({ children, delay = 0, y = 24, x = 0, className = "", as = "div", ...rest }: MotionBoxProps & { delay?: number; y?: number; x?: number }) {
    const reduce = useReducedMotion()
    const Tag = TAGS[as] ?? TAGS.div
    return (
        <Tag className={className}
            initial={reduce ? false : { opacity: 0, y, x }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease }}
            {...asDivProps(rest)}>
            {children}
        </Tag>
    )
}

export function Stagger({ children, className = "", gap = 0.07, delay = 0, as = "div", ...rest }: MotionBoxProps & { gap?: number; delay?: number }) {
    const Tag = TAGS[as] ?? TAGS.div
    return (
        <Tag className={className}
            initial="hidden" whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
            {...asDivProps(rest)}>
            {children}
        </Tag>
    )
}

export function Item({ children, className = "", y = 22, as = "div", ...rest }: MotionBoxProps & { y?: number }) {
    const reduce = useReducedMotion()
    const Tag = TAGS[as] ?? TAGS.div
    return (
        <Tag className={className}
            variants={{
                hidden: reduce ? { opacity: 1 } : { opacity: 0, y },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
            }}
            {...asDivProps(rest)}>
            {children}
        </Tag>
    )
}

const SCRIPT: Record<string, string> = { Store: "Take a little home", Journal: "Fresh from the pot", About: "Our story", Contact: "Say hello" }
interface PageHeaderProps {
    title: string
    intro?: string
    crumbs?: string[]
    script?: string
    children?: ReactNode
}

export function PageHeader({ title, intro, crumbs = [], script, children }: PageHeaderProps) {
    const reduce = useReducedMotion()
    const a = (d: number) => reduce ? {} : ({
        initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: d, ease },
    })
    const hand = script || SCRIPT[crumbs[0]]
    return (
        <header className="page-header container mt-10 mb-4">
            {crumbs.length > 0 && (
                <motion.nav {...a(0)} aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
                    <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                        <li><Link href="/" className="hover:text-link">Home</Link></li>
                        {crumbs.map((c) => (
                            <li key={c} className="flex items-center gap-2">
                                <span aria-hidden>/</span>
                                <span className="text-fg">{c}</span>
                            </li>
                        ))}
                    </ol>
                </motion.nav>
            )}
            <div className="flex flex-col gap-4 border-b-2 border-dotted border-line pb-6 md:flex-row md:items-end md:justify-between md:gap-10">
                <div>
                    {hand && <motion.span {...a(0.04)} className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--script)]">{hand}</motion.span>}
                    <motion.h1 {...a(0.08)} className="m-0 text-3xl leading-tight tracking-tight md:text-4xl" style={{ color: "var(--head)" }}>{title}</motion.h1>
                </div>
                {(intro || children) && (
                    <motion.div {...a(0.16)} className="md:max-w-sm">
                        {intro && <p className="mb-0 text-base leading-relaxed text-muted">{intro}</p>}
                        {children}
                    </motion.div>
                )}
            </div>
        </header>
    )
}

export function Print({ children, delay = 0, className = "", ...rest }: Omit<MotionBoxProps, "as"> & { delay?: number }) {
    const reduce = useReducedMotion()
    return (
        <motion.div className={className}
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", y: -16 }}
            whileInView={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
            {...asDivProps(rest)}>
            {children}
        </motion.div>
    )
}

interface SectionHeaderProps {
    title: string
    text?: string
    href?: string
    linkLabel?: string
    script?: string
    className?: string
    align?: "center" | "start"
}

export function SectionHeader({ title, text, href, linkLabel, script, className = "mb-12", align = "center" }: SectionHeaderProps) {
    const start = align === "start"
    const reduce = useReducedMotion()
    const words = String(title).split(" ")
    return (
        <div className={`${start ? "max-w-md text-start" : "mx-auto max-w-xl text-center"} ${className}`}>
            {script && <span className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--script)]">{script}</span>}
            <motion.h2 className={`m-0 flex flex-wrap ${start ? "justify-start" : "justify-center"} gap-x-[0.3em] text-3xl font-medium tracking-tight md:text-4xl`} style={{ color: "var(--head)" }}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}>
                {words.map((w, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                        <motion.span className="inline-block"
                            variants={{ hidden: reduce ? { y: 0 } : { y: "110%" }, show: { y: 0, transition: { duration: 0.6, ease } } }}>{w}</motion.span>
                    </span>
                ))}
            </motion.h2>
            {text && <Reveal delay={0.25} y={12}><p className={`${start ? "" : "mx-auto"} mt-3 mb-0 max-w-md text-base leading-relaxed text-muted`}>{text}</p></Reveal>}
            {href && <Reveal delay={0.35} y={10}><a href={href} className="link-more mt-4">{linkLabel}</a></Reveal>}
        </div>
    )
}

export function Float({ children, amount = 8, duration = 5, className = "" }: { children: ReactNode; amount?: number; duration?: number; className?: string }) {
    const reduce = useReducedMotion()
    return (
        <motion.div className={className} animate={reduce ? undefined : { y: [0, -amount, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}>
            {children}
        </motion.div>
    )
}

export function Parallax({ children, distance = 40, className = "" }: { children: ReactNode; distance?: number; className?: string }) {
    const reduce = useReducedMotion()
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
    return <motion.div className={className} style={reduce ? undefined : { y }}>{children}</motion.div>
}

export const MotionDiv = motion.div