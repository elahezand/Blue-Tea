import MenuTabs, { type MenuGroup } from "./menuTabs"
import { getCategories } from "@/services/category.service"
import type { MenuItem } from "@/types/models"

export default async function Menu() {
    const categories = await getCategories()
    // TODO: menu items request (removed for now): every menu item with its category
    const items: MenuItem[] = []

    const root = categories.find((c) => !c.parentId && c.slug === "menu")
    const sections = root
        ? categories.filter((c) => String(c.parentId) === String(root._id))
        : []

    const categoryId = (i: MenuItem) => (typeof i.category === "string" ? i.category : i.category?._id)

    const groups: MenuGroup[] = sections.map((cat) => ({
        id: String(cat._id),
        name: cat.name,
        items: items
            .filter((i) => String(categoryId(i)) === String(cat._id))
            .map((i) => ({ id: String(i._id), name: i.name, description: i.description || "", price: i.price })),
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
