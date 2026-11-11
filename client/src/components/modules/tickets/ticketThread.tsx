"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import ReplyForm from "@/components/modules/replyForm"
import Loader, { Spinner } from "@/components/feedback/loader"
import { useGetAdminTicket, useGetMyTicket, useGetTicketReplies, useRemoveTicket, useReplyTicket, useUpdateTicket } from "@/services/ticket.service"
import type { ID } from "@/types/api"
import type { Ticket, TicketWithUser } from "@/types/ticket"
import QueryErrorState from "@/components/feedback/queryErrorState"

const when = (d?: string) => (d ? new Date(d) : new Date()).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })

interface TicketThreadProps {
    id: ID
    isAdmin?: boolean
}

function Message({ ticket, isAdmin, customer }: { ticket: Pick<Ticket, "body" | "from" | "createdAt">; isAdmin: boolean; customer?: string }) {
    const staff = ticket.from === "admin"
    const me = isAdmin ? staff : !staff
    return (
        <li className={`flex ${me ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] rounded-3xl px-5 py-4 sm:max-w-[75%] ${staff ? "board !rounded-3xl" : "border-2 border-dashed border-line bg-surface text-fg"} ${me ? "rounded-br-lg" : "rounded-bl-lg"}`}>
                <p className={`m-0 mb-1 text-xs ${staff ? "text-[var(--lamp)]" : "text-muted"}`}>
                    {staff ? "Blue Tea support" : isAdmin ? (customer || "Customer") : "You"} · {when(ticket.createdAt)}
                </p>
                <p className="m-0 whitespace-pre-wrap break-words leading-relaxed">{ticket.body}</p>
            </div>
        </li>
    )
}

export default function TicketThread({ id, isAdmin = false }: TicketThreadProps) {
    const router = useRouter()
    const back = isAdmin ? "/p-admin/tickets" : "/account/tickets"
    const adminTicket = useGetAdminTicket(isAdmin ? id : undefined)
    const userTicket = useGetMyTicket(isAdmin ? undefined : id)
    const { data: ticket, isLoading, isError, refetch, isRefetching } = isAdmin ? adminTicket : userTicket
    const { data: repliesData, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetTicketReplies(ticket ? id : undefined)
    const { mutate: reply, isPending: replying } = useReplyTicket()
    const { mutate: update, isPending: updating } = useUpdateTicket()
    const { mutate: remove, isPending: removing } = useRemoveTicket(() => router.push(back))
    const replies = repliesData?.items ?? []

    if (isLoading) return <Loader inline label="Loading the ticket" />
    if (isError) return <QueryErrorState title="Couldn't load this ticket" onRetry={refetch} isRetrying={isRefetching} />
    if (!ticket) return <QueryErrorState title="This ticket was not found" text="Check the link, or go back to your tickets." />

    const customer = isAdmin ? (ticket as TicketWithUser).user?.name : undefined
    const closed = ticket.status === "Closed"

    const confirmRemove = () => swal({ title: "Delete this ticket?", icon: "warning", buttons: ["No", "Yes"] })
        .then((ok) => { if (ok) remove(id) })

    return (
        <div>
            <Link href={back} className="link-more mb-5">Back to tickets</Link>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b-2 border-dotted border-line pb-5">
                <div className="min-w-0">
                    <h2 className="m-0 mb-1 break-words text-2xl text-[var(--head)]">{ticket.subject}</h2>
                    <p className="m-0 text-sm text-muted">{ticket.department} · opened {when(ticket.createdAt)}{customer ? ` · ${customer}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge value={ticket.status} />
                    <button type="button" disabled={updating} onClick={() => update({ id, payload: { status: closed ? "Open" : "Closed" } })} className="btn-ghost">
                        {updating ? <Spinner label="Saving" /> : closed ? "Reopen" : "Close ticket"}
                    </button>
                    {isAdmin && <button type="button" disabled={removing} onClick={confirmRemove} className="btn-ghost !text-berry">Delete</button>}
                </div>
            </div>

            <ol className="m-0 mb-8 flex list-none flex-col gap-4 p-0">
                <Message ticket={{ ...ticket, from: "user" }} isAdmin={isAdmin} customer={customer} />
                {replies.map((r) => <Message key={r._id} ticket={r} isAdmin={isAdmin} customer={customer} />)}
            </ol>
            {hasNextPage && (
                <div className="mb-6 text-center">
                    <button type="button" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="btn-ghost">{isFetchingNextPage ? <Spinner label="Loading" /> : "Older messages"}</button>
                </div>
            )}

            {closed ? (
                <p className="rounded-2xl bg-soft/70 px-5 py-4 text-center text-sm text-muted">
                    This ticket is closed. {isAdmin ? "Reopen it to reply." : "Reopen it if you still need help."}
                </p>
            ) : (
                <div className="rounded-3xl border-2 border-dashed border-line bg-surface p-5">
                    <ReplyForm id="reply" label={isAdmin ? "Your reply" : "Add a message"} placeholder={isAdmin ? "Write an answer for the customer" : "Write your message"}
                        submitLabel={isAdmin ? "Send reply" : "Send message"} isPending={replying}
                        onSend={(body, done) => reply({ parent: id, body }, { onSuccess: done })} />
                </div>
            )}
        </div>
    )
}
