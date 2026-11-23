"use client"
import { useState } from "react"
import Badge from "@/components/modules/badge"
import { Spinner } from "@/components/feedback/loader"
import { useGetMyComments } from "@/services/comment.service"

type Tab = "" | "true" | "false"

const TABS: [Tab, string][] = [["", "All"], ["true", "Answered"], ["false", "Waiting"]]

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
                        const answers = c.answer ?? []
                        return (
                            <li key={c._id} className={`rounded-3xl border-2 border-dashed p-5 ${answers.length ? "border-[var(--green)]/50 bg-[var(--green)]/[0.06]" : "border-line bg-surface"}`}>
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-3">
                                        <span className="text-link" role="img" aria-label={`${c.score} out of 5 stars`}>{"★".repeat(c.score || 0)}<span className="opacity-30">{"★".repeat(5 - (c.score || 0))}</span></span>
                                        {c.productId?.name && <span className="text-sm text-muted">on {c.productId.name}</span>}
                                        {c.createdAt && <time dateTime={c.createdAt} className="text-sm text-muted">{c.createdAt.slice(0, 10)}</time>}
                                    </span>
                                    <span className="inline-flex gap-2">
                                        <Badge value={c.status === "rejected" ? "Rejected" : c.status === "accepted" ? "Approved" : "Pending"} />
                                        <Badge value={answers.length ? "Answered" : "Awaiting reply"} />
                                    </span>
                                </div>
                                <p className="m-0 text-fg">{c.body}</p>
                                {answers.map((a) => (
                                    <div key={a._id} className="board mt-3 !rounded-2xl p-4">
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
