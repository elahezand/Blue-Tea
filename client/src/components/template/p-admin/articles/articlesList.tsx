"use client"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { articleFilters } from "@/components/modules/p-admin/tableFilters"
import { Actions, actPrimary, actGhost, actDanger, day } from "@/components/modules/p-admin/cells"
import { useGetAdminArticles, useRemoveArticle } from "@/services/article.service"
import type { ID } from "@/types/api"

export default function ArticlesList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminArticles(params)
    const { mutate: removeArticle, isPending: removing, variables: removingId } = useRemoveArticle()
    const articles = data?.items ?? []

    const remove = (id: ID) => swal({ title: "Delete this article?", icon: "warning", buttons: ["No", "Yes"] })
        .then((ok) => { if (ok) removeArticle(id) })

    return (
        <Table title="All Articles" toolbar={<TableToolbar fields={articleFilters} />}>
            <thead>
                <tr><th>Article</th><th>Author</th><th>Written</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {articles.map((a) => {
                    const published = a.status === "publish"
                    return (
                        <tr key={a._id}>
                            <td className="!max-w-[380px]">
                                <div className="flex items-center gap-3">
                                    <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-soft">
                                        {a.cover && <Image fill sizes="44px" src={a.cover} alt="" className="no-tint object-cover" />}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium text-fg">{a.title}</span>
                                        <span className="block truncate text-xs text-muted">{a.shortDescription}</span>
                                    </span>
                                </div>
                            </td>
                            <td className="whitespace-nowrap">{a.author}</td>
                            <td className="whitespace-nowrap text-sm text-muted">{day(a.createdAt || a.date)}</td>
                            <td><Badge value={published ? "Published" : "Draft"} /></td>
                            <td>
                                <Actions>
                                    {published
                                        ? <Link href={`/p-admin/articles/${a._id}`} className={actGhost}>Edit</Link>
                                        : <Link href={`/p-admin/articles/draft?id=${a._id}`} className={actPrimary}>Continue draft</Link>}
                                    <button type="button" disabled={removing && removingId === a._id} onClick={() => remove(a._id)} className={actDanger}>Remove</button>
                                </Actions>
                            </td>
                        </tr>
                    )
                })}
                <TableState colSpan={5} isLoading={isLoading} isError={isError} isEmpty={!articles.length} emptyText="No articles match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
