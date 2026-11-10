import type { ReactNode } from "react"
import { TeaScene } from "@/components/modules/illustrations"
import Logo from "@/components/modules/logo"

const perks = ["Track your orders in one place", "Save your favorite products", "Faster checkout, every time"]

export default function AuthShell({ children }: { children: ReactNode }) {
    return (
        <div className="auth-wrap">
            <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-solid border-line bg-surface shadow-2xl shadow-black/5 lg:grid-cols-2">
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-[var(--navy)] p-10 text-white lg:flex">
                    <TeaScene className="no-tint absolute inset-0 h-full w-full opacity-25" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[var(--navy)]/70 via-[var(--navy)]/40 to-[var(--navy)]/90"></div>
                    <Logo light size={40} className="relative" />
                    <div className="relative">
                        <h2 className="mb-6 text-4xl leading-[1.15]">Your cozy corner for tea, coffee &amp; little discoveries.</h2>
                        <ul className="m-0 grid list-none gap-3 p-0 text-sm text-white/85">
                            {perks.map((p) => (
                                <li key={p} className="flex items-center gap-3">
                                    <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-[10px]">✓</span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="relative mb-0 text-xs text-white/60">© {new Date().getFullYear()} Blue Tea</p>
                </aside>
                <div className="flex flex-col justify-center p-8 sm:p-12">
                    <Logo size={32} className="mb-8 lg:hidden" />
                    {children}
                </div>
            </div>
        </div>
    )
}
