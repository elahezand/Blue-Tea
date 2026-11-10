import type { Metadata } from "next"
import { getArticles } from "@/services/article.service"
import type { RouteProps } from "@/types/api"
import { PageHeader } from "@/components/modules/motion"
import ArticlesList from "@/components/template/articles/articlesList"
import { getParam } from "@/utils/helper"

const TITLE = "The journal"
const DESCRIPTION = "Brewing guides, origin notes and news from the Blue Tea counter."

const readQuery = (value: string | string[] | undefined) => (getParam(value) || "").trim().slice(0, 60)

export async function generateMetadata({ searchParams }: Pick<RouteProps, "searchParams">): Promise<Metadata> {
    const q = readQuery((await searchParams).q)
    if (q) {
        return {
            title: `“${q}” in the journal`,
            robots: { index: false, follow: true },
            alternates: { canonical: "/articles" },
        }
    }

    return {
        title: "Journal",
        description: DESCRIPTION,
        alternates: { canonical: "/articles" },
        openGraph: {
            title: "Journal | Blue Tea",
            description: DESCRIPTION,
            url: "/articles",
            siteName: "Blue Tea",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Journal | Blue Tea",
            description: DESCRIPTION,
        },
    }
}

export default async function page() {
    const firstPage = await getArticles()

    return (
        <>
            <PageHeader crumbs={["Journal"]} title={TITLE} intro="Brewing guides, origin notes and news from the counter." />
            <div className="container py-10">
                <ArticlesList initialPage={firstPage} />
            </div>
        </>
    )
}