"use client"
import { useState, type FormEvent } from "react"
import Badge from "@/components/modules/badge"
import { Spinner } from "@/components/feedBack/Loader"
import type { Ticket, TicketStatus } from "@/types/models"

const when = (d?: string) => (d ? new Date(d) : new Date()).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })

/* One conversation. `isAdmin` flips which side "me" is on and who the other person is called. */
interface TicketThreadProps {
    ticket: Pick<Ticket, "_id" | "subject" | "department" | "status" | "messages" | "createdAt">
    isAdmin?: boolean
    customer?: string
}

export default function TicketThread({ ticket, isAdmin = false, customer }: TicketThreadProps) {
    const [text, setText] = useState("")
    const [busy] = useState(false)
    const [tried, setTried] = useState(false)
    const closed = ticket.status === "Closed"
    const mine = isAdmin ? "admin" : "user"

    const tooShort = text.trim().length < 2
    const send = (e: FormEvent) => {
        e.preventDefault(); setTried(true)
        if (tooShort) return document.getElementById("reply")?.focus()
        // TODO: reply request (removed for now): POST /tickets/:id { message: text }. On success: toast, clear text, router.refresh()
    }
    const setStatus = (status: TicketStatus) => {
        // TODO: status request (removed for now): PATCH /tickets/:id { status }. On success: toast + router.refresh()
        void status
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b-2 border-dotted border-line pb-5">
                <div className="min-w-0">
                    <h2 className="m-0 mb-1 break-words text-2xl text-[var(--head)]">{ticket.subject}</h2>
                    <p className="m-0 text-sm text-muted">
                        {ticket.department} · opened {when(ticket.createdAt)}{isAdmin && customer ? ` · ${customer}` : ""}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge value={ticket.status} />
                    <button type="button" disabled={busy} onClick={() => setStatus(closed ? "Open" : "Closed")} className="btn-ghost">
                        {closed ? "Reopen" : "Close ticket"}
                    </button>
                </div>
            </div>

            <ol className="m-0 mb-8 flex list-none flex-col gap-4 p-0">
                {ticket.messages.map((m, i) => {
                    const me = m.from === mine
                    const staff = m.from === "admin"
                    return (
                        <li key={m._id || i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[88%] rounded-3xl px-5 py-4 sm:max-w-[75%] ${staff ? "board !rounded-3xl" : "border-2 border-dashed border-line bg-surface text-fg"} ${me ? "rounded-br-lg" : "rounded-bl-lg"}`}>
                                <p className={`m-0 mb-1 text-xs ${staff ? "text-[var(--lamp)]" : "text-muted"}`}>
                                    {staff ? "Blue Tea support" : isAdmin ? (customer || "Customer") : "You"} · {when(m.createdAt)}
                                </p>
                                <p className="m-0 whitespace-pre-wrap break-words leading-relaxed">{m.text}</p>
                            </div>
                        </li>
                    )
                })}
            </ol>

            {closed ? (
                <p className="rounded-2xl bg-soft/70 px-5 py-4 text-center text-sm text-muted">
                    This ticket is closed. {isAdmin ? "Reopen it to reply." : "Reopen it if you still need help."}
                </p>
            ) : (
                <form onSubmit={send} noValidate className="rounded-3xl border-2 border-dashed border-line bg-surface p-5">
                    <label htmlFor="reply" className="field-label">{isAdmin ? "Your reply" : "Add a message"}</label>
                    <textarea id="reply" rows={4} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)}
                        placeholder={isAdmin ? "Write an answer for the customer" : "Write your message"} className="field mb-2 resize-y"
                        aria-invalid={tried && tooShort} aria-describedby={tried && tooShort ? "reply-err" : undefined} />
                    {tried && tooShort && <p id="reply-err" role="alert" className="auth-error !mt-0 mb-2">Write at least a couple of words before sending.</p>}
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-muted">{text.length}/2000</span>
                        <button type="submit" disabled={busy} className="classic">
                            {busy ? <Spinner label="Sending" /> : isAdmin ? "Send reply" : "Send message"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
