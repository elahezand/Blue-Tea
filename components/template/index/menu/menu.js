import CategoryModel from "@/model/category"
import menuItemModel from "@/model/menuItem"
import MenuTabs from "./menuTabs"

export default async function Menu() {
    const categories = await CategoryModel.find({}).lean()
    const items = await menuItemModel.find({}).populate("category").lean()

    const root = categories.find((c) => !c.parentId && c.slug === "menu")
    const sections = root
        ? categories.filter((c) => c.parentId?.toString() === root._id.toString())
        : []

    const groups = sections.map((cat) => ({
        id: cat._id.toString(),
        name: cat.name,
        items: items
            .filter((i) => i.category?._id?.toString() === cat._id.toString())
            .map((i) => ({ id: i._id.toString(), name: i.name, description: i.description || "", price: i.price })),
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
