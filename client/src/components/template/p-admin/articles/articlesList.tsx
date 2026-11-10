"use client"
import Link from 'next/link'
import Image from 'next/image'
import swal from '@/components/modules/swal'
import Badge from '@/components/modules/badge'
import type { Article, ID } from '@/types/models'
import { Actions, actPrimary, actGhost, actDanger, day } from '@/components/modules/p-admin/cells'

export default function ArticlesList({ data }: { data: Article[] }) {


    const removeArticle = (id: ID) => {
        swal({
            title: "Are You Sure To remove This item?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                // TODO: delete request (removed for now): DELETE /articles/:id. On success: toast + router.refresh()
                void id
            }
        })
    }

    return (
        <tbody>
            {data.map((a) => {
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
                                <button type="button" onClick={() => removeArticle(a._id)} className={actDanger}>Remove</button>
                            </Actions>
                        </td>
                    </tr>
                )
            })}
            {data.length === 0 && <tr><td colSpan={5} className="!py-10 text-center text-muted">No articles match.</td></tr>}
        </tbody>
    )
}
