import { MdLocalCafe } from "react-icons/md"

const drinks = ["Matcha latte", "Sencha", "Flat white", "Masala chai", "Cold brew", "Jasmine pearls", "Cardamom buns", "Oolong"]

export default function DrinksRibbon() {
    return (
        <div aria-hidden className="menu-ribbon bg-[var(--storefront-chrome)] py-4 text-[var(--cream)]">
            <div className="menu-ribbon-track flex w-max">
                {[0, 1].map((copy) => (
                    <div key={copy} className="menu-ribbon-group flex min-w-screen shrink-0 items-center justify-around">
                        {drinks.map((drink, index) => (
                            <span key={drink} className="flex shrink-0 items-center whitespace-nowrap">
                                <span className={index % 2 ? "script px-5 text-2xl text-[var(--script-on-navy)] sm:px-7" : "px-5 font-display text-lg italic sm:px-7"}>{drink}</span>
                                <MdLocalCafe className="size-4 text-[var(--lamp)]/80" />
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
