import MenuTabs, { type MenuGroup } from "./menuTabs"
import { getMenu } from "@/services/menu.service"

export default async function Menu() {
    const sections = await getMenu()

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

    if (!groups.length) return null
    return (
        <section id="menu" className="!py-0">
            <MenuTabs groups={groups} />
        </section>
    )
}
