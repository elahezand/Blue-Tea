import styles from "@/styles/about.module.css"
import Link from 'next/link'
import Image from 'next/image'
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

export default function page() {
    return (
        <div className="py-5">
            <div className="header">
                <h1 className="fw-bold">About Us</h1>
                <p className="text-white col-md-8 mx-auto">
                    We are dedicated to delivering high-quality products with a focus on customer satisfaction.
                    Our team works passionately to make your experience unforgettable.
                </p>
            </div>
            <Link href="index.html"
                className={styles.navbar_brand}>
                <Image
                    width={100}
                    height={100}
                    className="img-fluid"
                    src="/images/b67706a7-8ec4-4706-b58d-a889093e4988_removalai_preview.png"
                    alt="Logo"
                    priority

                />
            </Link>
            <div className={styles.container_content}>
                <h2 className="fw-bold mb-3">Our Story</h2>
                <h3 className={styles.title}>whats make our coffee special!</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum natus nam numquam quo illum similique a mollitia distinctio! Fuga, doloremque nesciunt cumque tenetur corporis, eius debitis dolorem natus neque beatae laboriosam accusamus incidunt commodi non aliquam facilis perspiciatis cum omnis dicta dolore. Iure, cupiditate sed omnis, in nulla illum, maiores labore laboriosam placeat culpa animi libero aliquam ipsum rem voluptatem corporis accusantium incidunt esse reprehenderit aliquid. Omnis recusandae numquam corporis minima aperiam Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem odit est ullam at aspernatur accusamus vel Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint iusto totam inventore expedita commodi ex voluptate ratione ut porro quo eveniet similique earum temporibus id dolore molestias voluptatum ad optio, consectetur pariatur exercitationem labore aspernatur laudantium incidunt? Obcaecati nemo eum, sint perferendis explicabo blanditiis corrupti quia, in quisquam optio ullam rerum quis harum laudantium placeat debitis tempora, est nam tenetur nostrum illo cum odit velit? Deserunt soluta quia quasi, praesentium impedit tempore. Assumenda, non amet placeat ipsa laboriosam minima minus nam tenetur! Eligendi voluptatum laudantium deserunt ipsam ut molestias dolor quam, incidunt laboriosam ratione tempore consectetur quia nihil illum corrupti. Minus omnis enim veniam laudantium illum ullam! Quam, adipisci nesciunt, corporis animi itaque dolores illum sed fuga minima, necessitatibus consequatur quas eaque ullam! Quas nulla consequuntur quam placeat iusto accusamus quaerat neque, laudantium suscipit incidunt deserunt dolore necessitatibus maxime aliquam magni a ratione minima. Assumenda iusto quaerat quam, quae blanditiis vel laboriosam at eaque sequi in temporibus alias magni maxime perspiciatis fugit aperiam corrupti corporis modi voluptatem doloremque sed. Saepe at optio natus, ullam nisi cum dignissimos exercitationem facilis sint, earum eius id adipisci, veritatis distinctio nulla libero autem excepturi? Doloribus quos explicabo deserunt quidem reiciendis porro numquam tempore dolore.</p>
                <p>
                    Our mission is simple: provide natural, trusted and beautiful products you can rely on.
                </p>

            </div>

            <div className="py-5">
                <div className="header">
                    <h3>Our Values</h3>
                </div>
                <div className="container">
                    <div className="row g-4">
                        <div className={`${styles.value_box} col-md-4`}>
                            <div className="px-4 py-3 bg-white shadow-sm h-100">
                                <h5 className="fw-bold">Quality</h5>
                                <p>We never compromise on product quality. Every item is carefully selected and inspected.</p>
                            </div>
                        </div>

                        <div className={`${styles.value_box} col-md-4`}>
                            <div className="px-4 py-3 bg-white shadow-sm h-100">
                                <h5 className="fw-bold">Nature Friendly</h5>
                                <p className="text-muted">We believe in sustainable production and respecting the environment.</p>
                            </div>
                        </div>

                        <div className={`${styles.value_box} col-md-4`}>
                            <div className="px-4 py-3 bg-white shadow-sm h-100">
                                <h5 className="fw-bold">Customer First</h5>
                                <p className="text-muted">Your happiness matters. We work constantly to exceed your expectations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
