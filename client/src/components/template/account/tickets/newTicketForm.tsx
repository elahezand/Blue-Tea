"use client"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/feedback/loader"
import { useCreateTicket } from "@/services/ticket.service"
import { applyFieldErrors } from "@/utils/apiError"
import { TICKET_DEPARTMENTS, ticketSchema, type TicketInput } from "@/validators/ticket"

export default function NewTicketForm() {
    const router = useRouter()
    const { mutate: createTicket, isPending } = useCreateTicket((ticket) => router.push(`/account/tickets/${ticket._id}`))
    const { register, handleSubmit, setError, control, formState: { errors } } = useForm<TicketInput>({
        resolver: zodResolver(ticketSchema),
        defaultValues: { subject: "", department: "Order", body: "" },
    })
    const length = useWatch({ control, name: "body" }).length

    const onSubmit = (values: TicketInput) => createTicket(values, { onError: (error) => applyFieldErrors(error, setError) })

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl rounded-3xl border-2 border-dashed border-line bg-surface p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <label htmlFor="subject" className="field-label">Subject</label>
                    <input id="subject" {...register("subject")} maxLength={100} placeholder="For example: my order has not arrived"
                        className="field" aria-invalid={!!errors.subject} />
                    {errors.subject && <p role="alert" className="auth-error">{errors.subject.message}</p>}
                </div>
                <div>
                    <label htmlFor="department" className="field-label">Topic</label>
                    <select id="department" {...register("department")} className="field">
                        {TICKET_DEPARTMENTS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                </div>
            </div>
            <label htmlFor="body" className="field-label mt-4">Message</label>
            <textarea id="body" rows={7} maxLength={2000} {...register("body")}
                placeholder="Tell us what happened. Add your order number if you have one." className="field mb-2 resize-y" aria-invalid={!!errors.body} />
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>{errors.body && <p role="alert" className="auth-error !mt-0">{errors.body.message}</p>}</div>
                <span className="shrink-0 text-xs text-muted">{length}/2000</span>
            </div>
            <button type="submit" disabled={isPending} className="classic">
                {isPending ? <Spinner label="Sending" /> : "Send ticket"}
            </button>
        </form>
    )
}
