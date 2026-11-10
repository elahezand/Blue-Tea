import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { PageHeader, Reveal, Stagger, Item } from "@/components/modules/motion"
import { TeaScene } from "@/components/modules/illustrations"
import { getAboutContent } from "@/services/about.service"
const DEFAULT_IMAGE = "/images/about-og-image.jpg"

export async function generateMetadata(): Promise<Metadata> {
    const about = await getAboutContent()
    const title = about.seo?.title || about.title
    const description = about.seo?.description || about.intro || ""
    const image = about.seo?.image || about.story.image || DEFAULT_IMAGE

    return {
        title,
        description,
        alternates: { canonical: "/about" },
        openGraph: {
            title,
            description,
            url: "/about",
            siteName: "Blue Tea",
            images: [{ url: image, width: 1200, height: 630, alt: title }],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    }
}

export default async function page() {
    const about = await getAboutContent()

    return (
        <>
            <PageHeader
                crumbs={["About"]}
                title={about.title}
                intro={about.intro} />
            <section>
                <div className="container grid items-center gap-12 lg:grid-cols-2">
                    <Reveal>
                        {about.story.image ? (
                            <div className="no-tint relative aspect-[5/6] w-full overflow-hidden rounded-2xl bg-soft">
                                <Image src={about.story.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                            </div>
                        ) : (
                            <TeaScene className="aspect-[5/6] w-full rounded-2xl" />
                        )}
                    </Reveal>
                    <Reveal delay={0.1} className="text-fg">
                        <h2 className="mb-5 text-3xl font-semibold">{about.story.heading}</h2>
                        {about.story.paragraphs.map((text, i) => (
                            <p key={i} className="max-w-prose leading-[1.8] text-muted">{text}</p>
                        ))}
                        <Link href="/products" className="btn-organic mt-2 inline-flex bg-brown px-6 py-3 text-sm font-medium !text-white">Browse the store</Link>
                    </Reveal>
                </div>
            </section>
            {about.values.length > 0 && (
                <section className="band">
                    <div className="container">
                        <Reveal as="h2" className="mb-8 text-3xl font-semibold text-fg">What we care about</Reveal>
                        <Stagger className="grid gap-6 md:grid-cols-3">
                            {about.values.map((v) => (
                                <Item key={v.title} className="rounded-xl border border-solid border-line bg-surface p-6">
                                    <h3 className="mb-2 text-xl text-fg">{v.title}</h3>
                                    <p className="m-0 text-muted">{v.text}</p>
                                </Item>
                            ))}
                        </Stagger>
                    </div>
                </section>
            )}
        </>
    )
}