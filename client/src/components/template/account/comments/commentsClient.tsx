"use client"
import { useState } from "react"
import Badge from "@/components/modules/badge"
import { Spinner } from "@/components/feedback/loader"
import { useGetMyComments } from "@/services/comment.service"
import type { Comment, CommentAnswer } from "@/types/comment"

type Tab = "" | "true" | "false"

const TABS: [Tab, string][] = [["", "All"], ["true", "Answered"], ["false", "Waiting"]]

const answersOf = (c: Pick<Comment, "answer">): CommentAnswer[] => {
    const raw = c.answer as unknown
    const list = Array.isArray(raw) ? raw : raw ? [raw] : []
    return list.map((a: CommentAnswer | string) => (typeof a === "string" ? { text: a } : a))
}

const chip = (on: boolean) => `cursor-pointer whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`

export default function CommentsClient() {
    const [tab, setTab] = useState<Tab>("")
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetMyComments(tab ? { answered: tab } : {})
    const comments = data?.items ?? []

    return (
        <>
            <div className="mb-5 flex gap-2 overflow-x-auto" role="group" aria-label="Show comments">
                {TABS.map(([key, label]) => (
                    <button key={label} type="button" onClick={() => setTab(key)} aria-pressed={tab === key} className={chip(tab === key)}>{label}</button>
                ))}
            </div>
            {isLoading ? (
                <p className="py-10 text-center text-muted"><Spinner label="Loading your comments" /></p>
            ) : comments.length === 0 ? (
                <p className="rounded-2xl bg-soft/70 px-5 py-10 text-center text-muted">{tab ? "Nothing here." : "You have not written any comments yet."}</p>
            ) : (
                <ul className="m-0 flex list-none flex-col gap-4 p-0">
                    {comments.map((c) => {
                        const answers = answersOf(c)
                        return (
                            <li key={c._id} className={`rounded-3xl border-2 border-dashed p-5 ${answers.length ? "border-[var(--green)]/50 bg-[var(--green)]/[0.06]" : "border-line bg-surface"}`}>
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-3">
                                        <span className="text-link" role="img" aria-label={`${c.score} out of 5 stars`}>{"★".repeat(c.score || 0)}<span className="opacity-30">{"★".repeat(5 - (c.score || 0))}</span></span>
                                        {c.productID?.name && <span className="text-sm text-muted">on {c.productID.name}</span>}
                                        <span className="text-sm text-muted">{(c.createdAt || c.date || "").slice(0, 10)}</span>
                                    </span>
                                    <span className="inline-flex gap-2">
                                        <Badge value={c.status === "rejected" ? "Rejected" : c.status === "accepted" || c.isAccept ? "Approved" : "Pending"} />
                                        <Badge value={answers.length ? "Answered" : "Awaiting reply"} />
                                    </span>
                                </div>
                                <p className="m-0 text-fg">{c.body}</p>
                                {answers.map((a, k) => (
                                    <div key={a._id || k} className="board mt-3 !rounded-2xl p-4">
                                        <p className="mb-1 text-xs text-[var(--lamp)]">Blue Tea replied</p>
                                        <p className="m-0 text-sm leading-relaxed">{a.text}</p>
                                    </div>
                                ))}
                            </li>
                        )
                    })}
                </ul>
            )}
            {hasNextPage && (
                <div className="mt-6 text-center">
                    <button type="button" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="btn-ghost">{isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}</button>
                </div>
            )}
        </>
    )
}
