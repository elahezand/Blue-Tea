"use client"
import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { MdStar, MdStarBorder, MdOutlineReply, MdCheck, MdClose, MdExpandLess } from "react-icons/md"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import ReplyForm from "@/components/modules/replyForm"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { commentFilters } from "@/components/modules/p-admin/tableFilters"
import { actPrimary, actGhost, actDanger, day } from "@/components/modules/p-admin/cells"
import { useAcceptComment, useGetAdminComments, useRejectComment, useRemoveComment, useReplyComment } from "@/services/comment.service"
import { useInfiniteProducts } from "@/services/product.service"
import type { ID } from "@/types/api"

const STATUS_LABEL = { accepted: "Approved", pending: "Waiting", rejected: "Rejected" } as const

function Stars({ n = 0 }: { n?: number }) {
    return (
        <span className="inline-flex gap-px" role="img" aria-label={`${n} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => i < n ? <MdStar key={i} size={14} color="var(--lamp)" /> : <MdStarBorder key={i} size={14} color="var(--lamp)" />)}
        </span>
    )
}


export default function CommentsList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminComments(params)
    const { data: productPages } = useInfiniteProducts({ limit: 100 })
    const [open, setOpen] = useState<ID | null>(null)
    const { mutate: reply, isPending: replying } = useReplyComment()
    const { mutate: accept, isPending: accepting } = useAcceptComment()
    const { mutate: reject, isPending: rejecting } = useRejectComment()
    const { mutate: removeComment } = useRemoveComment()
    const comments = data?.items ?? []
    const products = (productPages?.items ?? []).map((p) => ({ value: String(p._id), label: p.name }))

    const remove = (id: ID) => swal({ title: "Delete this comment?", text: "Its answers will be deleted too.", icon: "warning", buttons: ["No", "Yes"] })
        .then((ok) => { if (ok) removeComment(id) })

    const askReject = (id: ID) => swal({ title: "Why are you rejecting it?", text: "The customer will see this reason.", content: "input", button: "Reject" })
        .then((reason) => {
            if (typeof reason === "string" && reason.trim().length >= 3) reject({ id, payload: { reason: reason.trim() } })
        })

    return (
        <Table title="All Comments" toolbar={<TableToolbar fields={commentFilters(products)} />}>
            <thead>
                <tr><th>Customer</th><th>Comment</th><th>Posted</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {comments.map((c) => {
                    const answers = c.answer ?? []
                    const answered = answers.length > 0
                    const isOpen = open === c._id
                    const status = c.status ?? "pending"
                    return (
                        <React.Fragment key={c._id}>
                            <tr className={isOpen ? "!bg-soft/50" : ""}>
                                <td className="!max-w-[220px]">
                                    <div className="flex items-center gap-3">
                                        <span className="relative shrink-0">
                                            <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-soft font-medium text-link">{(c.username || "?").charAt(0).toUpperCase()}</span>
                                            {!answered && (
                                                <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-solid border-[var(--surface)] bg-[var(--lamp)]" title="No answer yet">
                                                    <span className="sr-only">No answer yet</span>
                                                </span>
                                            )}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium text-fg">{c.username}</span>
                                            <span className="block truncate text-xs text-muted">{c.email}</span>
                                        </span>
                                    </div>
                                </td>
                                <td className="!max-w-[340px] !whitespace-normal">
                                    <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                        <Stars n={c.score} />
                                        {c.productId?.name && <span className="text-xs text-muted">on {c.productId.name}</span>}
                                    </div>
                                    <p className="m-0 line-clamp-2 text-sm leading-snug text-fg">{c.body}</p>
                                </td>
                                <td className="whitespace-nowrap text-sm text-muted">{day(c.createdAt)}</td>
                                <td className="!max-w-[180px] !whitespace-normal">
                                    <div className="flex flex-col items-start gap-1.5">
                                        <Badge value={STATUS_LABEL[status]} />
                                        {answered && <Badge value="Answered" />}
                                        {status === "rejected" && c.rejectReason && <span className="text-xs text-muted">{c.rejectReason}</span>}
                                    </div>
                                </td>
                                <td className="!max-w-none">
                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" onClick={() => setOpen(isOpen ? null : c._id)} aria-expanded={isOpen} className={answered ? actGhost : actPrimary}>
                                            {isOpen ? <MdExpandLess aria-hidden className="text-base" /> : <MdOutlineReply aria-hidden className="text-base" />}
                                            {isOpen ? "Close" : answered ? "View / reply" : "Answer"}
                                        </button>
                                        {status !== "accepted" && (
                                            <button type="button" disabled={accepting} onClick={() => accept({ id: c._id })} className={actGhost}>
                                                <MdCheck aria-hidden className="text-base" />Approve
                                            </button>
                                        )}
                                        {status !== "rejected" && (
                                            <button type="button" disabled={rejecting} onClick={() => askReject(c._id)} className={actDanger}>
                                                <MdClose aria-hidden className="text-base" />Reject
                                            </button>
                                        )}
                                        <button type="button" onClick={() => remove(c._id)} className={actDanger}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                            {isOpen && (
                                <tr className="!bg-soft/30">
                                    <td colSpan={5} className="!max-w-none !whitespace-normal !px-6 !py-5">
                                        <div className="grid gap-6 lg:grid-cols-2">
                                            <div>
                                                <p className="mb-1 text-xs font-medium text-muted">{c.username} wrote</p>
                                                <p className="m-0 whitespace-pre-wrap rounded-2xl border border-dashed border-line bg-surface p-4 text-sm leading-relaxed text-fg">{c.body}</p>
                                                {answers.map((a) => (
                                                    <div key={a._id} className="board mt-3 !rounded-2xl p-4">
                                                        <p className="mb-1 text-xs text-[var(--lamp)]">{a.username || "Blue Tea"}{a.createdAt ? ` · ${day(a.createdAt)}` : ""}</p>
                                                        <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed">{a.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <ReplyForm id={`reply-${c._id}`} label={answered ? "Add another answer" : "Your answer"} placeholder="Visitors will see this under their comment"
                                                submitLabel="Send answer" isPending={replying} onCancel={() => setOpen(null)}
                                                onSend={(body, done) => reply({ parent: c._id, body }, { onSuccess: done })} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    )
                })}
                <TableState colSpan={5} isLoading={isLoading} isError={isError} isEmpty={!comments.length} emptyText="No comments match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}
