"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { Spinner } from "@/components/feedBack/Loader"

const topics = ["Order", "Reservation", "Shop", "Website", "Other"]

export default function NewTicketForm() {
    const router = useRouter()
    const [form, setForm] = useState({ subject: "", department: "Order", message: "" })
    const [busy, setBusy] = useState(false)
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
    const [touched, setTouched] = useState({})
    const rules = {
        subject: (v) => (v.trim().length < 3 ? "Add a short subject, at least 3 characters." : ""),
        message: (v) => (v.trim().length < 5 ? "Tell us a little more, at least 5 characters." : ""),
    }
    const errors = { subject: rules.subject(form.subject), message: rules.message(form.message) }
    const show = (k) => touched[k] && errors[k]
    const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

    const submit = async (e) => {
        e.preventDefault()
        setTouched({ subject: true, message: true })
        const first = ["subject", "message"].find((k) => errors[k])
        if (first) return document.getElementById(first)?.focus()
        setBusy(true)
        try {
            const { data } = await axios.post("/api/tickets", form)
            toast.success("Ticket sent. We will reply here.")
            router.push(`/account/tickets/${data.id}`)
            router.refresh()
        } catch (err) {
            toast.error(err?.response?.data?.message || "Could not send your ticket. Please try again.")
            setBusy(false)
        }
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
