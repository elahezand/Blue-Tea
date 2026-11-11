"use client"
import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { MdExpandLess, MdOutlineMailOutline } from "react-icons/md"
import Badge from "@/components/modules/badge"
import ReplyForm from "@/components/modules/replyForm"
import Table from "@/components/modules/table/table"
import TableState from "@/components/modules/table/tableState"
import TableToolbar from "@/components/modules/p-admin/tableToolbar"
import { contactFilters } from "@/components/modules/p-admin/tableFilters"
import { Person, Actions, actPrimary, actGhost, day } from "@/components/modules/p-admin/cells"
import { useGetAdminContacts, useReplyContact } from "@/services/contact.service"
import type { ID } from "@/types/api"
import type { Contact } from "@/types/contact"

const answersOf = (c: Contact): string[] => (Array.isArray(c.answer) ? c.answer : c.answer ? [c.answer] : [])

export default function ContactsList() {
    const params = Object.fromEntries(useSearchParams().entries())
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetAdminContacts(params)
    const { mutate: reply, isPending: replying } = useReplyContact()
    const [open, setOpen] = useState<ID | null>(null)
    const contacts = data?.items ?? []

    return (
        <Table title="All Contacts" toolbar={<TableToolbar fields={contactFilters} />}>
            <thead>
                <tr><th>From</th><th>Message</th><th>Received</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {contacts.map((c) => {
                    const isOpen = open === c._id
                    const answers = answersOf(c)
                    return (
                        <React.Fragment key={c._id}>
                            <tr className={isOpen ? "!bg-soft/50" : ""}>
                                <td className="!max-w-[240px]"><Person name={c.name} sub={c.email} /></td>
                                <td className="!max-w-[360px] !whitespace-normal">
                                    <p className="m-0 line-clamp-2 text-sm leading-snug text-fg">{c.body}</p>
                                    {(c.company || c.phone) && <p className="m-0 mt-1 truncate text-xs text-muted">{[c.company, c.phone].filter(Boolean).join(" · ")}</p>}
                                </td>
                                <td className="whitespace-nowrap text-sm text-muted">{day(c.createdAt)}</td>
                                <td><Badge value={answers.length ? "Answered" : "New"} /></td>
                                <td>
                                    <Actions>
                                        <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c._id)} className={isOpen ? actGhost : actPrimary}>
                                            {isOpen ? <MdExpandLess aria-hidden className="text-base" /> : null}{isOpen ? "Close" : "Read / reply"}
                                        </button>
                                        {c.email && <a href={`mailto:${c.email}`} className={actGhost}><MdOutlineMailOutline aria-hidden className="text-base" />Email</a>}
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
                                                        <p className="mb-1 text-xs text-[var(--lamp)]">Your answer</p>
                                                        <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed">{a}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <ReplyForm id={`reply-${c._id}`} label="Your answer" placeholder="This will be sent to the customer"
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
