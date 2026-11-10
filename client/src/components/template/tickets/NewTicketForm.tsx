"use client"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Spinner } from "@/components/feedBack/Loader"

const topics = ["Order", "Reservation", "Shop", "Website", "Other"]

interface TicketForm {
    subject: string
    department: string
    message: string
}

type Checked = "subject" | "message"

export default function NewTicketForm() {
    const [form, setForm] = useState<TicketForm>({ subject: "", department: "Order", message: "" })
    const [busy] = useState(false)
    const set = (k: keyof TicketForm) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
    const [touched, setTouched] = useState<Partial<Record<Checked, boolean>>>({})
    const rules: Record<Checked, (v: string) => string> = {
        subject: (v) => (v.trim().length < 3 ? "Add a short subject, at least 3 characters." : ""),
        message: (v) => (v.trim().length < 5 ? "Tell us a little more, at least 5 characters." : ""),
    }
    const errors: Record<Checked, string> = { subject: rules.subject(form.subject), message: rules.message(form.message) }
    const show = (k: Checked) => touched[k] && errors[k]
    const blur = (k: Checked) => () => setTouched((t) => ({ ...t, [k]: true }))

    const submit = (e: FormEvent) => {
        e.preventDefault()
        setTouched({ subject: true, message: true })
        const first = (["subject", "message"] as Checked[]).find((k) => errors[k])
        if (first) return document.getElementById(first)?.focus()
        // TODO: new-ticket request (removed for now), payload: form.
        // On success: toast + router.push(`/account/tickets/${id}`) + router.refresh()
    }

    return (
        <form onSubmit={submit} noValidate className="max-w-2xl rounded-3xl border-2 border-dashed border-line bg-surface p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <label htmlFor="subject" className="field-label">Subject</label>
                    <input id="subject" value={form.subject} onChange={set("subject")} onBlur={blur("subject")} maxLength={100} placeholder="For example: my order has not arrived"
                        className="field" aria-invalid={!!show("subject")} aria-describedby={show("subject") ? "subject-err" : undefined} />
                    {show("subject") && <p id="subject-err" role="alert" className="auth-error">{errors.subject}</p>}
                </div>
                <div>
                    <label htmlFor="department" className="field-label">Topic</label>
                    <select id="department" value={form.department} onChange={set("department")} className="field">
                        {topics.map((t) => <option key={t}>{t}</option>)}
                    </select>
                </div>
            </div>
            <label htmlFor="message" className="field-label mt-4">Message</label>
            <textarea id="message" rows={7} maxLength={2000} value={form.message} onChange={set("message")} onBlur={blur("message")}
                placeholder="Tell us what happened. Add your order number if you have one." className="field mb-2 resize-y"
                aria-invalid={!!show("message")} aria-describedby={show("message") ? "message-err" : undefined} />
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>{show("message") && <p id="message-err" role="alert" className="auth-error !mt-0">{errors.message}</p>}</div>
                <span className="shrink-0 text-xs text-muted">{form.message.length}/2000</span>
            </div>
            <button type="submit" disabled={busy} className="classic">
                {busy ? <Spinner label="Sending" /> : "Send ticket"}
            </button>
        </form>
    )
}
