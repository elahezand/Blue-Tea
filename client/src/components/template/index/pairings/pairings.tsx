import Image from "next/image"
import Link from "next/link"
import { MdOutlineBakeryDining, MdOutlineLunchDining, MdOutlineWbSunny } from "react-icons/md"
import { SectionHeader } from "@/components/modules/motion"
import type { MenuSection } from "@/types/menu"

const suggestions = [
    { occasion: "For breakfast", Icon: MdOutlineWbSunny, drink: ["cappuccino"], food: ["buttermilk pancakes", "pancakes"] },
    { occasion: "With something sweet", Icon: MdOutlineBakeryDining, drink: ["rosehip tea", "chamomile tea", "english breakfast tea"], food: ["carrot cake"] },
    { occasion: "For a light lunch", Icon: MdOutlineLunchDining, drink: ["peach iced tea", "iced tea", "lemonade"], food: ["chicken pesto panini"] },
]

export default function Pairings({ menu }: { menu: MenuSection[] }) {
    const items = new Map(menu.flatMap(section => section.items.map(item => [item.name.trim().toLowerCase(), item.name] as const)))
    const pick = (names: string[]) => names.map(name => items.get(name)).find(Boolean)
    const pairings = suggestions.flatMap(({ occasion, Icon, drink, food }) => {
        const drinkName = pick(drink)
        const foodName = pick(food)
        return drinkName && foodName ? [{ occasion, Icon, drinkName, foodName }] : []
    })
    if (!pairings.length) return null

    return (
        <section aria-labelledby="home-pairings-title">
            <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="min-w-0">
                    <SectionHeader
                        titleId="home-pairings-title"
                        script="A little menu help"
                        title="First time here?"
                        align="start"
                        className="mb-5"
                    />
                    <ul className="m-0 mb-5 list-none divide-y divide-line border-y border-line p-0">
                        {pairings.map(({ occasion, Icon, drinkName, foodName }) => (
                            <li key={occasion} className="flex items-center gap-3 py-3.5 sm:gap-4">
                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-soft text-link">
                                    <Icon aria-hidden className="size-5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="m-0 text-sm text-muted">{occasion}</p>
                                    <p className="m-0 mt-1 font-display text-lg text-fg sm:text-xl">
                                        {drinkName} <span className="text-link">+</span> {foodName}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Link href="#menu" className="link-more">View the full menu</Link>
                </div>
                <figure className="polaroid polaroid-static relative m-0 w-full">
                    <span aria-hidden className="tape tape-sm -top-2 left-1 z-10 -rotate-[28deg]" />
                    <span aria-hidden className="tape tape-sm -bottom-2 right-2 z-10 -rotate-[28deg]" />
                    <div className="relative aspect-[4/3] overflow-hidden bg-soft">
                        <Image
                            src="/images/blue-tea-cafe-window-table.webp"
                            alt="A view inside Blue Tea Café"
                            fill
                            sizes="(min-width: 992px) 45vw, 100vw"
                            className="no-tint object-cover object-[center_63%]"
                        />
                        <Image
                            src="/images/blue-tea-cafe-window-table-winter.webp"
                            alt=""
                            fill
                            sizes="(min-width: 992px) 45vw, 100vw"
                            className="christmas-photo no-tint object-cover object-[center_63%]"
                        />
                    </div>
                </figure>
            </div>
        </section>
    )
}
