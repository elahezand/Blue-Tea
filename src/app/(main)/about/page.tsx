
export async function generateMetadata() {
    return {
        title: "About Us - Your Company Name",
        description: "Learn more about our story, mission, and values. We are dedicated to delivering high-quality products with a focus on customer satisfaction.",
        openGraph: {
            title: "About Us - Your Company Name",
            description: "Learn more about our story, mission, and values.",
            url: "https://yourdomain.com/about",
            siteName: "Your Company Name",
            images: [
                {
                    url: "https://yourdomain.com/images/about-og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "About Us",
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "About Us - Your Company Name",
            description: "Learn more about our story, mission, and values.",
            images: ["https://yourdomain.com/images/about-og-image.jpg"],
        },
    };
}

import { PageHeader, Reveal, Stagger, Item } from "@/components/modules/motion"
import { TeaScene } from "@/components/modules/illustrations"
import Link from "next/link"

const values = [
    { title: "Quality first", text: "Every leaf, bean and cup is chosen and tasted before it reaches the shelf or the counter." },
    { title: "Easy on nature", text: "We buy from small growers and keep packaging simple, so less of it ends up as waste." },
    { title: "Made for you", text: "Tell us how you like your tea or coffee and we will brew it, or help you pick it for home." },
]

export default function page() {
    return (
        <>
            <PageHeader
                crumbs={["About"]}
                title="A tea house with a shop next door"
                intro="Blue Tea started as one counter and a handful of teas. It is still small, and still brewed to order." />
            <section>
                <div className="container grid items-center gap-12 lg:grid-cols-2">
                    <Reveal>
                        <TeaScene className="aspect-[5/6] w-full rounded-2xl" />
                    </Reveal>
                    <Reveal delay={0.1} className="text-fg">
                        <h2 className="mb-5 text-3xl font-semibold">Our story</h2>
                        <p className="max-w-prose leading-[1.8] text-muted">We opened Blue Tea to serve the kind of tea and coffee we wanted to drink: fresh, carefully sourced and made when you order it.</p>
                        <p className="max-w-prose leading-[1.8] text-muted">Guests kept asking where to buy the leaves, so we added a shop. Today you can sit down for a cup, then take the same blend, a brewer and a cup home.</p>
                        <Link href="/products" className="btn-organic mt-2 inline-flex bg-brown px-6 py-3 text-sm font-medium !text-white">Browse the store</Link>
                    </Reveal>
                </div>
            </section>
            <section className="band">
                <div className="container">
                    <Reveal as="h2" className="mb-8 text-3xl font-semibold text-fg">What we care about</Reveal>
                    <Stagger className="grid gap-6 md:grid-cols-3">
                        {values.map((v) => (
                            <Item key={v.title} className="rounded-xl border border-solid border-line bg-surface p-6">
                                <h3 className="mb-2 text-xl text-fg">{v.title}</h3>
                                <p className="m-0 text-muted">{v.text}</p>
                            </Item>
                        ))}
                    </Stagger>
                </div>
            </section>
        </>
    )
}
