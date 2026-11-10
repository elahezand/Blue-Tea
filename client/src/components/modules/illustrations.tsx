"use client"
import { motion, useReducedMotion } from "framer-motion"

/* About visual: an espresso machine, a coffee and a shelf of products, drawn with the theme colors so it follows light/dark. */
export function TeaScene({ className = "" }) {
    const reduce = useReducedMotion()
    const steam = (d: string, delay: number) => (
        <motion.path d={d} fill="none" stroke="var(--muted)" strokeWidth="5" strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={reduce ? undefined : { pathLength: [0, 1, 1], opacity: [0, 0.6, 0], y: [0, 0, -14] }}
            transition={{ duration: 3.6, delay, repeat: Infinity, ease: "easeOut" }}
            style={reduce ? { opacity: 0.45 } : undefined} />
    )
    return (
        <svg viewBox="0 0 600 750" role="img" aria-label="Illustration of an espresso machine, a coffee and a shelf of products"
            className={className} preserveAspectRatio="xMidYMid slice">
            <rect width="600" height="750" fill="var(--soft)" />
            <circle cx="300" cy="420" r="225" fill="var(--surface)" />
            {/* shop shelf: tins and a bag of leaves */}
            <g>
                <rect x="90" y="214" width="420" height="12" rx="6" fill="var(--line)" />
                <rect x="110" y="140" width="64" height="74" rx="8" fill="var(--accent)" />
                <rect x="110" y="156" width="64" height="22" fill="#fff" opacity=".25" />
                <rect x="190" y="124" width="64" height="90" rx="8" fill="#6fbf8a" />
                <rect x="190" y="146" width="64" height="22" fill="#fff" opacity=".3" />
                <path d="M290 214v-96l14-12h46l14 12v96z" fill="var(--fg)" opacity=".9" />
                <path d="M290 132h74" stroke="var(--surface)" strokeWidth="4" opacity=".6" />
                <circle cx="327" cy="170" r="14" fill="#6fbf8a" />
                <rect x="394" y="148" width="60" height="66" rx="8" fill="#c58a4b" />
                <rect x="394" y="164" width="60" height="20" fill="#fff" opacity=".28" />
                <rect x="466" y="170" width="28" height="44" rx="6" fill="var(--accent)" opacity=".75" />
            </g>
            {/* leaves */}
            <g fill="#6fbf8a">
                <path d="M512 610c-22-15-22-48 0-70 22 22 22 55 0 70z" transform="rotate(30 512 575)" opacity=".7" />
                <path d="M70 640c-16-11-16-36 0-52 16 16 16 41 0 52z" transform="rotate(-50 70 615)" opacity=".6" />
            </g>
            {/* counter */}
            <rect x="60" y="600" width="480" height="14" rx="7" fill="var(--line)" />
            <rect x="80" y="614" width="440" height="90" rx="10" fill="var(--soft)" opacity=".0" />
            {/* espresso machine */}
            <g>
                <rect x="120" y="396" width="230" height="204" rx="16" fill="var(--accent)" />
                <rect x="120" y="396" width="230" height="40" rx="16" fill="#fff" opacity=".16" />
                <circle cx="168" cy="466" r="20" fill="#fff" opacity=".9" />
                <circle cx="168" cy="466" r="12" fill="var(--accent)" opacity=".55" />
                <rect x="212" y="452" width="100" height="10" rx="5" fill="#fff" opacity=".35" />
                <rect x="212" y="474" width="64" height="10" rx="5" fill="#fff" opacity=".25" />
                <rect x="150" y="520" width="170" height="14" rx="7" fill="#000" opacity=".18" />
                <rect x="226" y="534" width="18" height="30" rx="4" fill="var(--fg)" opacity=".85" />
                <rect x="140" y="580" width="190" height="20" rx="6" fill="#000" opacity=".18" />
                <rect x="170" y="364" width="130" height="32" rx="10" fill="var(--accent)" />
            </g>
            {/* coffee cup with latte art */}
            <g>
                <ellipse cx="450" cy="598" rx="70" ry="10" fill="var(--line)" />
                <path d="M396 520h108v16a54 54 0 0 1-54 54 54 54 0 0 1-54-54v-16z" fill="var(--fg)" opacity=".92" />
                <path d="M504 530h9a22 22 0 0 1 0 44h-16" fill="none" stroke="var(--fg)" strokeWidth="9" strokeLinecap="round" opacity=".92" />
                <ellipse cx="450" cy="520" rx="54" ry="9" fill="#b8793f" />
                <path d="M450 515c-12-3-16 5-8 8 5 2 8-2 8-2s3 4 8 2c8-3 4-11-8-8z" fill="#f4e2c8" />
            </g>
            {/* steam */}
            <g>
                {steam("M450 500c-16-20 16-34 0-54", 0)}
                {steam("M470 496c-16-20 16-34 0-54", 1.2)}
            </g>
        </svg>
    )
}

const SKIN = ["#e8b896", "#c68e6a", "#f0c9a8", "#a9704f"]
const HAIR = ["#2b2118", "#6b4a2f", "#1d1d24", "#8a8f98"]

/* Flat, faceless portrait used for the team when there is no photo. */
export function Portrait({ index = 0, className = "", label = "" }) {
    const skin = SKIN[index % SKIN.length]
    const hair = HAIR[index % HAIR.length]
    const hairShape = [
        <path key="h" d="M110 150c0-38 26-58 40-58s40 20 40 58c-10-20-28-26-40-26s-30 6-40 26z" fill={hair} />,
        <g key="h"><circle cx="150" cy="86" r="22" fill={hair} /><path d="M108 156c0-40 24-62 42-62s42 22 42 62c-12-22-28-28-42-28s-30 6-42 28z" fill={hair} /></g>,
        <path key="h" d="M106 150c-2-44 24-66 44-66 22 0 46 22 44 66-8-16-20-30-44-30s-36 14-44 30z" fill={hair} />,
        <path key="h" d="M104 170c-6-52 22-82 46-82s52 30 46 82c-6-22-14-40-46-40s-40 18-46 40z" fill={hair} />,
    ][index % 4]
    const top = ["var(--accent)", "var(--fg)", "#6fbf8a", "var(--accent)"][index % 4]
    return (
        <svg viewBox="0 0 300 400" role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}
            className={className} preserveAspectRatio="xMidYMid slice">
            <rect width="300" height="400" fill="var(--soft)" />
            <circle cx="150" cy="190" r="128" fill="var(--surface)" />
            <path d="M40 400c0-70 46-112 110-112s110 42 110 112z" fill={top} />
            <path d="M118 400l32-70 32 70z" fill="#fff" opacity=".18" />
            <rect x="134" y="236" width="32" height="56" rx="14" fill={skin} />
            <ellipse cx="150" cy="190" rx="44" ry="52" fill={skin} />
            {hairShape}
            <path d="M132 352h36v48h-36z" fill="#000" opacity=".08" />
        </svg>
    )
}

/* Reservation visual: a table for two under a warm lamp. Drawn on navy, so it looks the same in both themes. */
export function TableScene({ className = "" }) {
    const reduce = useReducedMotion()
    const steam = (d: string, delay: number) => (
        <motion.path d={d} fill="none" stroke="#f6efe2" strokeWidth="3" strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={reduce ? undefined : { pathLength: [0, 1, 1], opacity: [0, 0.55, 0], y: [0, 0, -8] }}
            transition={{ duration: 3.4, delay, repeat: Infinity, ease: "easeOut" }}
            style={reduce ? { opacity: 0.4 } : undefined} />
    )
    return (
        <svg viewBox="0 0 640 400" role="img" aria-label="Illustration of a table for two under a hanging lamp, with a teapot and two cups"
            className={className} preserveAspectRatio="xMidYMid slice">
            <defs>
                <radialGradient id="ts-glow" cx="50%" cy="0%" r="70%">
                    <stop offset="0" stopColor="#f0c27a" stopOpacity=".55" />
                    <stop offset="1" stopColor="#f0c27a" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="640" height="400" fill="#1a3272" />
            {/* awning */}
            <g>
                {Array.from({ length: 10 }).map((_, i) => (
                    <path key={i} d={`M${i * 64} 0h64v26a32 32 0 0 1-64 0z`} fill={i % 2 ? "#f6efe2" : "#2f55a4"} />
                ))}
            </g>
            {/* lamp + glow */}
            <path d="M320 44v76" stroke="#f6efe2" strokeWidth="2" opacity=".6" />
            <ellipse cx="320" cy="250" rx="210" ry="210" fill="url(#ts-glow)" />
            <path d="M292 150a28 28 0 0 1 56 0z" fill="#f0c27a" transform="translate(0 -30)" />
            <path d="M290 120h60l-8 16h-44z" fill="#f0c27a" />
            <circle cx="320" cy="142" r="7" fill="#fff6dc" />
            {/* floor */}
            <rect y="338" width="640" height="62" fill="#142a60" />
            {/* chairs */}
            <g fill="#2f55a4">
                <path d="M120 218a44 44 0 0 1 88 0v54h-88z" />
                <rect x="112" y="272" width="104" height="20" rx="8" />
                <path d="M432 218a44 44 0 0 1 88 0v54h-88z" />
                <rect x="424" y="272" width="104" height="20" rx="8" />
            </g>
            <g stroke="#c58a4b" strokeWidth="5" strokeLinecap="round">
                <path d="M128 292v54M204 292v54M436 292v54M512 292v54" />
            </g>
            {/* table */}
            <ellipse cx="320" cy="262" rx="112" ry="16" fill="#f6efe2" />
            <rect x="313" y="276" width="14" height="62" fill="#f6efe2" opacity=".85" />
            <ellipse cx="320" cy="338" rx="44" ry="7" fill="#f6efe2" opacity=".85" />
            {/* teapot */}
            <g>
                <path d="M300 250a26 22 0 0 1 52 0v6h-52z" fill="#fff" />
                <path d="M352 238c14-4 20 4 14 12" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M300 242c-10-6-14 0-12 6" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
                <rect x="318" y="224" width="16" height="6" rx="3" fill="#fff" />
                <path d="M300 238h52" stroke="#2f55a4" strokeWidth="3" opacity=".5" />
            </g>
            {/* cups */}
            <g fill="#fff">
                <path d="M244 252h30v6a15 12 0 0 1-30 0z" />
                <path d="M274 254c8 0 8 8 0 8" stroke="#fff" strokeWidth="3" fill="none" />
                <path d="M374 252h30v6a15 12 0 0 1-30 0z" />
                <path d="M404 254c8 0 8 8 0 8" stroke="#fff" strokeWidth="3" fill="none" />
            </g>
            {steam("M322 218c-6-8 6-12 0-22", 0)}
            {steam("M259 244c-5-7 5-10 0-18", 0.9)}
            {steam("M389 244c-5-7 5-10 0-18", 1.7)}
            {/* plant */}
            <g>
                <path d="M572 338v-48" stroke="#3f8f5f" strokeWidth="4" />
                <path d="M572 300c-26-6-34-26-30-40 22 4 36 20 30 40z" fill="#3f8f5f" />
                <path d="M572 290c24-8 32-26 28-38-20 4-34 18-28 38z" fill="#4fa774" />
                <path d="M556 338h32l-4-30h-24z" fill="#c58a4b" />
            </g>
        </svg>
    )
}
