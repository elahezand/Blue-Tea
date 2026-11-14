import { MdThermostat, MdTimer, MdLocalCafe } from "react-icons/md"
import type { Product } from "@/types/product"

type BrewGuideProps = Pick<Product, "brewTemp" | "brewTime" | "brewAmount">

export default function BrewGuide({ brewTemp, brewTime, brewAmount }: BrewGuideProps) {
    const steps = [
        brewAmount && { icon: MdLocalCafe, label: "Leaves", value: brewAmount },
        brewTemp && { icon: MdThermostat, label: "Water", value: `${brewTemp}°C` },
        brewTime && { icon: MdTimer, label: "Steep", value: brewTime },
    ].filter((step): step is { icon: typeof MdTimer; label: string; value: string } => !!step)

    if (!steps.length) return null

    return (
        <section aria-labelledby="brew-guide" className="board mt-8 !rounded-3xl p-5">
            <p className="script m-0 text-xl text-[var(--lamp)]">How we brew it</p>
            <h2 id="brew-guide" className="sr-only">Brewing guide</h2>
            <ul className="m-0 mt-3 grid list-none grid-cols-3 gap-3 p-0">
                {steps.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-dashed border-white/20 px-2 py-4 text-center">
                        <Icon aria-hidden className="text-2xl text-[var(--lamp)]" />
                        <span className="text-xs uppercase tracking-wider text-white/60">{label}</span>
                        <span className="font-display text-lg font-semibold text-[var(--cream)]">{value}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}