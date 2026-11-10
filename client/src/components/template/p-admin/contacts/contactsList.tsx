"use client"
import React, { useState } from 'react'
import type { Contact, ID } from '@/types/models'
import swal from '@/components/modules/swal'
import Badge from '@/components/modules/badge'
import { Person, Actions, actPrimary, actGhost, actDanger, day } from '@/components/modules/p-admin/cells'
import { MdExpandLess, MdOutlineMailOutline, MdBlock } from "react-icons/md"

export default function ContactsList({ data }: { data: Contact[] }) {
    const [open, setOpen] = useState<ID | null>(null)

    const banUser = (name: string, email: string) => swal({ title: `Ban ${name}?`, icon: "warning", buttons: ["No", "Yes, ban"] }).then((ok) => {
        // TODO: ban request (removed for now): POST /users/ban { username: name, email }. On success: toast + router.refresh()
        if (ok) void email
    })
    const answered = (c: Contact) => Array.isArray(c.answer) ? c.answer.length > 0 : !!c.answer

    if (!data.length) return <tbody><tr><td colSpan={5} className="!py-10 text-center text-muted">No messages match.</td></tr></tbody>

    return (
        <tbody>
            {data.map((c) => {
                const isOpen = open === c._id
                return (
                    <React.Fragment key={c._id}>
                        <tr className={isOpen ? "!bg-soft/50" : ""}>
                            <td className="!max-w-[240px]"><Person name={c.name} sub={c.email} /></td>
                            <td className="!max-w-[360px] !whitespace-normal">
                                <p className="m-0 line-clamp-2 text-sm leading-snug text-fg">{c.body}</p>
                                {(c.company || c.phone) && <p className="m-0 mt-1 truncate text-xs text-muted">{[c.company, c.phone].filter(Boolean).join(" · ")}</p>}
                            </td>
                            <td className="whitespace-nowrap text-sm text-muted">{day(c.createdAt)}</td>
                            <td><Badge value={answered(c) ? "Answered" : "New"} /></td>
                            <td>
                                <Actions>
                                    <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c._id)} className={isOpen ? actGhost : actPrimary}>
                                        {isOpen ? <MdExpandLess aria-hidden className="text-base" /> : null}{isOpen ? "Close" : "Read"}
                                    </button>
                                    {c.email && <a href={`mailto:${c.email}`} className={actGhost}><MdOutlineMailOutline aria-hidden className="text-base" />Email</a>}
                                    <button type="button" onClick={() => banUser(c.name, c.email)} className={actDanger}><MdBlock aria-hidden className="text-base" />Ban</button>
                                </Actions>
                            </td>
                        </tr>
                        {isOpen && (
                            <tr className="!bg-soft/30">
                                <td colSpan={5} className="!max-w-none !whitespace-normal !px-6 !py-5">
                                    <p className="mb-1 text-xs font-medium text-muted">{c.name} wrote</p>
                                    <p className="m-0 max-w-3xl whitespace-pre-wrap rounded-2xl border border-dashed border-line bg-surface p-4 text-sm leading-relaxed text-fg">{c.body}</p>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                )
            })}
        </tbody>
    )
}
