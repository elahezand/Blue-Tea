"use client"
import Loader from '@/components/feedBack/Loader'
import React, { useCallback, useEffect } from 'react'
import Badge from '@/components/modules/badge'
import { useGet } from '@/utils/hooks/useReactQueryPanel';
import Pagination from '@/components/modules/pagination/pagination';
import { useContext } from 'react';
import { UserContext } from '@/utils/context/userProvider';
import swal from '@/components/modules/swal'


export default function CommentsClient() {
    const [tab, setTab] = React.useState("all")
    const { user } = useContext(UserContext);
    const userId = user?.id || user?._id;

    const { data, isLoading } = useGet(
        `/comments/${userId}`,
        {},
        { enabled: !!userId }
    );

    const showContent = useCallback((content) => {
        swal({
            title: "Content",
            text: content,
            icon: "info",
            button: "Close"
        });
    }, [])

    const showAnswer = useCallback((answer) => {
        swal({
            title: "Content",
            text: answer,
            icon: "info",
            button: "Close"
        });
    }, [])

    if (isLoading) return <Loader inline label="Loading your comments" />

    const answersOf = (c) => (Array.isArray(c.answer) ? c.answer : c.answer ? [c.answer] : []).map((a) => (typeof a === "string" ? { text: a } : a))
    const all = data?.data || []
    const list = tab === "answered" ? all.filter((c) => answersOf(c).length) : tab === "waiting" ? all.filter((c) => !answersOf(c).length) : all
    const nAnswered = all.filter((c) => answersOf(c).length).length
    const chip = (on) => `cursor-pointer whitespace-nowrap rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition-colors ${on ? "border-brown bg-brown text-white" : "border-line bg-surface text-fg hover:border-brown/50"}`

    return (
        <>
            {all.length > 0 && (
                <div className="mb-5 flex gap-2 overflow-x-auto" role="group" aria-label="Show comments">
                    {[["all", "All", all.length], ["answered", "Answered", nAnswered], ["waiting", "Waiting", all.length - nAnswered]].map(([k, label, n]) => (
                        <button key={k} type="button" onClick={() => setTab(k)} aria-pressed={tab === k} className={chip(tab === k)}>{label} <span className={tab === k ? "text-white/80" : "text-muted"}>{n}</span></button>
                    ))}
                </div>
            )}
            {list.length === 0 ? (
                <p className="rounded-2xl bg-soft/70 px-5 py-10 text-center text-muted">{all.length ? "Nothing here." : "You have not written any comments yet."}</p>
            ) : (
                <ul className="m-0 flex list-none flex-col gap-4 p-0">
                    {list.map((c, i) => {
                        const answers = answersOf(c)
                        return (
                            <li key={c._id || i} className={`rounded-3xl border-2 border-dashed p-5 ${answers.length ? "border-[var(--green)]/50 bg-[var(--green)]/[0.06]" : "border-line bg-surface"}`}>
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                                    <span className="inline-flex items-center gap-3">
                                        <span className="text-link" role="img" aria-label={`${c.score} out of 5 stars`}>{"★".repeat(c.score || 0)}<span className="opacity-30">{"★".repeat(5 - (c.score || 0))}</span></span>
                                        <span className="text-sm text-muted">{c.date ? c.date.slice(0, 10) : ""}</span>
                                    </span>
                                    <span className="inline-flex gap-2">
                                        <Badge value={c.isAccept ? "Approved" : "Pending"} />
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
            <Pagination
                currentPage={data?.page}
                pageCount={data?.pageCount}
                limit={data?.limit} />
        </>
    )
}
