"use client"
import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { MdExpandLess, MdOutlineMailOutline } from "react-icons/md"
import swal from "@/components/modules/swal"
import Badge from "@/components/modules/badge"
import ReplyForm from "@/components/modules/replyForm"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { contactFilters } from "@/components/modules/p-admin/tableFilters"
import { Avatar, Actions, actPrimary, actGhost, actDanger, day } from "@/components/modules/p-admin/cells"
import { useGetAdminContacts, useRemoveContact, useReplyContact } from "@/services/contact.service"
import type { ID } from "@/types/api"

export default function ContactsList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminContacts(params)
    const { mutate: reply, isPending: replying } = useReplyContact()
    const { mutate: removeContact } = useRemoveContact()
  
    const [open, setOpen] = useState<ID | null>(null)
    const contacts = data?.items ?? []

    const remove = (id: ID) => swal({ title: "Delete this message?", text: "This can not be undone.", icon: "warning", buttons: ["No", "Yes"] })
        .then((ok) => { if (ok) removeContact(id) })

    return (
        <Table title="All Contacts" toolbar={<TableToolbar fields={contactFilters} />}>
            <thead>
                <tr><th>From</th><th>Message</th><th>Received</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {contacts.map((c) => {
                    const isOpen = open === c._id
                    const answers = c.answer ?? []
                    const answered = !!c.answeredAt || answers.length > 0
                    return (
                        <React.Fragment key={c._id}>
                            <tr className={isOpen ? "!bg-soft/50" : ""}>
                                <td className="!max-w-[240px]">
                                    <div className="flex items-center gap-3">
                                        <span className="relative shrink-0">
                                            <Avatar name={c.name} />
                                            {!answered && (
                                                <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-solid border-[var(--surface)] bg-[var(--lamp)]" title="No answer yet">
                                                    <span className="sr-only">No answer yet</span>
                                                </span>
                                            )}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium text-fg">{c.name}</span>
                                            <span className="block truncate text-xs text-muted">{c.email}</span>
                                        </span>
                                    </div>
                                </td>
                                <td className="!max-w-[360px] !whitespace-normal">
                                    <p className="m-0 line-clamp-2 text-sm leading-snug text-fg">{c.body}</p>
                                    {(c.company || c.phone) && <p className="m-0 mt-1 truncate text-xs text-muted">{[c.company, c.phone].filter(Boolean).join(" · ")}</p>}
                                </td>
                                <td className="whitespace-nowrap text-sm text-muted">{day(c.createdAt)}</td>
                                <td className="!whitespace-normal">
                                    <div className="flex flex-col items-start gap-1">
                                        <Badge value={answered ? "Answered" : "New"} />
                                        {c.answeredAt && <span className="text-xs text-muted">{day(c.answeredAt)}</span>}
                                    </div>
                                </td>
                                <td>
                                    <Actions>
                                        <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c._id)} className={isOpen ? actGhost : actPrimary}>
                                            {isOpen ? <MdExpandLess aria-hidden className="text-base" /> : null}{isOpen ? "Close" : "Read / reply"}
                                        </button>
                                        {c.email && <a href={`mailto:${c.email}`} className={actGhost}><MdOutlineMailOutline aria-hidden className="text-base" />Email</a>}
                                        <button type="button" onClick={() => remove(c._id)} className={actDanger}>Delete</button>
                                    </Actions>
                                </td>
                            </tr>
                            {isOpen && (
                                <tr className="!bg-soft/30">
                                    <td colSpan={5} className="!max-w-none !whitespace-normal !px-6 !py-5">
                                        <div className="grid gap-6 lg:grid-cols-2">
                                            <div>
                                                <p className="mb-1 text-xs font-medium text-muted">{c.name} wrote</p>
                                                <p className="m-0 whitespace-pre-wrap rounded-2xl border border-dashed border-line bg-surface p-4 text-sm leading-relaxed text-fg">{c.body}</p>
                                                {answers.map((a, i) => (
                                                    <div key={i} className="board mt-3 !rounded-2xl p-4">
                                                        <p className="mb-1 text-xs text-[var(--lamp)]">Emailed answer</p>
                                                        <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed">{a}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <ReplyForm id={`reply-${c._id}`} label={answers.length ? "Send another answer" : "Your answer"} placeholder={`This will be emailed to ${c.email}`}
                                                submitLabel="Send answer" isPending={replying} onCancel={() => setOpen(null)}
                                                onSend={(body, done) => reply({ contact: c._id, body }, { onSuccess: done })} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    )
                })}
                <TableState colSpan={5} isLoading={isLoading} isError={isError} isEmpty={!contacts.length} emptyText="No messages match."
                    hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </tbody>
        </Table>
    )
}