import MenuTabs, { type MenuGroup } from "./menuTabs"
import { getMenu } from "@/services/menu.service"

export default async function Menu() {
    const sections = await getMenu()

    const groups: MenuGroup[] = sections
        .filter((section) => section.items?.length)
        .map((section) => ({
            id: String(section._id),
            name: section.name,
            items: section.items.map((i) => ({ id: String(i._id), name: i.name, description: i.description || "", price: i.price })),
        }))

    if (!groups.length) return null

    return (
        <section id="menu" className="!py-12 lg:!py-16">
            <div className="container">
                <MenuTabs groups={groups} />
            </div>
        </section>
    )
}
