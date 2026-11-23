import MenuTabs, { type MenuGroup } from "./menuTabs"
import type { MenuSection } from "@/types/menu"
import { SectionHeader } from "@/components/modules/motion"
import DrinksRibbon from "./drinksRibbon"

export default function Menu({ sections }: { sections: MenuSection[] }) {
    const groups: MenuGroup[] = sections
        .filter((section) => section.items?.length)
        .map((section) => ({
            id: String(section._id),
            name: section.name,
            items: section.items.map((it) => ({
                id: String(it._id),
                name: it.name,
                description: it.description ?? "",
                price: it.price,
                size: it.size,
                img: it.img,
            })),
        }))

    return (
        <section id="menu" tabIndex={-1} className="scroll-mt-16 bg-canvas !pt-8 !pb-8 sm:!pt-10 sm:!pb-10 lg:!pt-14 lg:!pb-12">
            <div className="container">
                <SectionHeader
                    script="Brewed to order"
                    title="Today’s menu"
                    text="Ask at the counter what is fresh from the oven."
                    className="mb-8 sm:mb-12"
                />
            </div>
            {groups.length ? <MenuTabs groups={groups} /> : (
                <div className="cafe-menu-board px-5 py-12">
                    <p className="m-0 text-center">The online menu is currently unavailable.</p>
                </div>
            )}
            <DrinksRibbon />
        </section>
    )
}
