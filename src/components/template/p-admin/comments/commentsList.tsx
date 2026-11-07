"use client"
import React, { useState, type FormEvent } from 'react'
import swal from '@/components/modules/swal'
import Badge from '@/components/modules/badge'
import { Spinner } from '@/components/feedBack/Loader'
import type { Comment, CommentAnswer, CommentWithProduct, ID } from '@/types/models'
import { MdStar, MdStarBorder, MdOutlineReply, MdCheck, MdBlock, MdExpandLess } from "react-icons/md"

// answer can come back as a list, one object or a plain string
const answersOf = (c: Pick<Comment, "answer">): CommentAnswer[] => {
    const raw = c.answer as unknown
    const list = Array.isArray(raw) ? raw : raw ? [raw] : []
    return list.map((a: CommentAnswer | string) => (typeof a === "string" ? { text: a } : a))
}
const day = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-")

function Stars({ n = 0 }: { n?: number }) {
    return (
        <span className="inline-flex gap-px" role="img" aria-label={`${n} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => i < n ? <MdStar key={i} size={14} color="var(--lamp)" /> : <MdStarBorder key={i} size={14} color="var(--lamp)" />)}
        </span>
    )
}

const act = "inline-flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-solid px-3 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60"
const actPrimary = `${act} border-brown bg-brown text-white hover:brightness-110`
const actGhost = `${act} border-line bg-surface text-fg hover:border-brown/50 hover:bg-soft`
const actDanger = `${act} border-line bg-surface text-berry hover:border-berry/50 hover:bg-berry/10`

export default function CommentsList({ data }: { data: CommentWithProduct[] }) {
    const [open, setOpen] = useState<ID | null>(null)
    const [text, setText] = useState("")
    const sending = false
    const toggling = false

    const toggleReply = (id: ID) => { setText(""); setOpen(open === id ? null : id) }
    const send = (e: FormEvent, id: ID) => {
        e.preventDefault()
        // TODO: answer request (removed for now): POST /comments/answer { answer: text.trim(), commentID: id }
        // On success: toast, close the box, clear text, router.refresh()
        if (text.trim().length >= 2) void id
    }
    const acceptToggle = (id: ID) => {
        // TODO: accept / hide request (removed for now): PUT /comments/:id/accept. On success: toast + router.refresh()
        void id
    }
    const ban = (email: string, username: string) => swal({ title: `Ban ${username}?`, text: "They will not be able to sign in.", icon: "warning", buttons: ["No", "Yes, ban"] })
        .then((ok) => {
            // TODO: ban request (removed for now): POST /users/ban { email, username }. On success: toast + router.refresh()
            if (ok) void email
        })

    if (!data.length) return <tbody><tr><td colSpan={5} className="!py-10 text-center text-muted">No comments match.</td></tr></tbody>

    return (
        <tbody>
            {data.map((c) => {
                const answers = answersOf(c)
                const isOpen = open === c._id
                return (
                    <React.Fragment key={c._id}>
                        <tr className={isOpen ? "!bg-soft/50" : ""}>
                            <td className="!max-w-[220px]">
                                <div className="flex items-center gap-3">
                                    <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-soft font-medium text-link">{(c.username || "?").charAt(0).toUpperCase()}</span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium text-fg">{c.username}</span>
                                        <span className="block truncate text-xs text-muted">{c.email}</span>
                                    </span>
                                </div>
                            </td>
                            <td className="!max-w-[340px] !whitespace-normal">
                                <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                    <Stars n={c.score} />
                                    {c.productID?.name && <span className="text-xs text-muted">on {c.productID.name}</span>}
                                </div>
                                <p className="m-0 line-clamp-2 text-sm leading-snug text-fg">{c.body}</p>
                            </td>
                            <td className="whitespace-nowrap text-sm text-muted">{day(c.date)}</td>
                            <td>
                                <div className="flex flex-col items-start gap-1.5">
                                    <Badge value={c.isAccept ? "Approved" : "Hidden"} />
                                    <Badge value={answers.length ? "Answered" : "Awaiting reply"} />
                                </div>
                            </td>
                            <td className="!max-w-none">
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" onClick={() => toggleReply(c._id)} aria-expanded={isOpen} className={answers.length ? actGhost : actPrimary}>
                                        {isOpen ? <MdExpandLess aria-hidden className="text-base" /> : <MdOutlineReply aria-hidden className="text-base" />}
                                        {isOpen ? "Close" : answers.length ? "View / reply" : "Answer"}
                                    </button>
                                    <button type="button" disabled={toggling} onClick={() => acceptToggle(c._id)} className={c.isAccept ? actDanger : actGhost}>
                                        {c.isAccept ? "Reject" : <><MdCheck aria-hidden className="text-base" />Approve</>}
                                    </button>
                                    <button type="button" onClick={() => ban(c.email, c.username)} className={actDanger} aria-label={`Ban ${c.username}`}>
                                        <MdBlock aria-hidden className="text-base" />Ban
                                    </button>
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
                                            {answers.map((a, i) => (
                                                <div key={a._id || i} className="board mt-3 !rounded-2xl p-4">
                                                    <p className="mb-1 text-xs text-[var(--lamp)]">Your answer{a.createdAt ? ` · ${day(a.createdAt)}` : ""}</p>
                                                    <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed">{a.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <form onSubmit={(e) => send(e, c._id)}>
                                            <label htmlFor={`a-${c._id}`} className="field-label !text-xs">{answers.length ? "Add another answer" : "Your answer"}</label>
                                            <textarea id={`a-${c._id}`} rows={4} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} className="field mb-3 resize-y" placeholder="Visitors will see this under their comment" />
                                            <div className="flex items-center justify-end gap-2">
                                                <button type="button" onClick={() => toggleReply(c._id)} className="btn-ghost !h-9">Cancel</button>
                                                <button type="submit" disabled={sending || text.trim().length < 2} className="classic">{sending ? <Spinner label="Sending" /> : "Send answer"}</button>
                                            </div>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                )
            })}
        </tbody>
    )
}
