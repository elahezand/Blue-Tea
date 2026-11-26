import { getProducts } from "@/services/product.service"
import TeaGuide, { type TeaChoice } from "./teaGuide"

const profiles = [
    { label: "Soft & floral", tag: "soft-floral", fallbackTag: "delicate" },
    { label: "Fresh & herbal", tag: "fresh-herbal", fallbackTag: "herbal" },
    { label: "Bold & full-bodied", tag: "bold-full-bodied", fallbackTag: "roasted" },
]

const getTeasByTag = async (tag: string) => {
    const page = await getProducts("herbal-teas", { tag, limit: 2 }).catch(() => null)
    return page?.data ?? []
}

export default async function TeaGuideSection() {
    const choices = await Promise.all(profiles.map(async ({ label, tag, fallbackTag }) => {
        const tagged = await getTeasByTag(tag)
        const products = tagged.length ? tagged : await getTeasByTag(fallbackTag)
        const teas = products.map(({ _id, name, notes, shortDescription }) => ({
            product: { _id, name },
            note: notes?.filter(Boolean).join(" · ") || shortDescription,
        }))
        return { label, teas } satisfies TeaChoice
    }))

    return <TeaGuide choices={choices.filter(choice => choice.teas.length > 0)} />
}
