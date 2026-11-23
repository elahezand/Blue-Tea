"use client"

import { useForm } from "react-hook-form"
import { useCreateNotification, useNotificationRecipients } from "@/services/notification.service"
import type { CreateNotificationBody, NotificationType } from "@/types/notification"
import { applyFieldErrors } from "@/utils/apiError"

type FormFields = Omit<CreateNotificationBody, "scope">

const types: NotificationType[] = ["message", "order", "reservation", "ticket", "comment"]

export default function CreateNotificationForm({ onClose }: { onClose: () => void }) {
    const { data: recipients = [], isPending: loadingRecipients, isError, refetch } = useNotificationRecipients()
    const { mutate, isPending: sending } = useCreateNotification()
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormFields>({
        defaultValues: { user: "", type: "message", title: "", text: "", href: "/p-admin/notifications" },
    })

    const submit = ({ text, ...fields }: FormFields) => mutate({
        ...fields,
        scope: "admin",
        title: fields.title.trim(),
        href: fields.href.trim(),
        text: text?.trim() || undefined,
    }, {
        onSuccess: onClose,
        onError: (error) => {
            if (!applyFieldErrors(error, setError)) {
                setError("root.server", { type: "server", message: error.message })
            }
        },
    })

    const errorFor = (field: keyof FormFields) => errors[field] && (
        <p id={`notification-${field}-error`} className="auth-error" role="alert">{errors[field].message}</p>
    )

    return (
        <form id="create-admin-notification" onSubmit={handleSubmit(submit)} noValidate className="mb-6 rounded-2xl border border-line bg-surface p-5" aria-labelledby="create-notification-title">
            <h2 id="create-notification-title" className="mb-4 text-xl text-fg">Send a notification</h2>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                    <label htmlFor="notification-user" className="field-label">Recipient</label>
                    <select id="notification-user" className="field" disabled={loadingRecipients || isError || !recipients.length}
                        aria-invalid={!!errors.user} aria-describedby={errors.user ? "notification-user-error" : undefined}
                        {...register("user", { required: "Select a recipient" })}>
                        <option value="">{loadingRecipients ? "Loading admins…" : "Select an admin"}</option>
                        {recipients.map((recipient) => (
                            <option key={recipient.id} value={recipient.id}>
                                {recipient.name || `Admin · ${recipient.id.slice(-6)}`}{recipient.isSelf ? " (you)" : ""}
                            </option>
                        ))}
                    </select>
                    {errorFor("user")}
                    {isError && <button type="button" onClick={() => void refetch()} className="link-more">Couldn’t load admins. Try again</button>}
                    {!isError && !loadingRecipients && !recipients.length && <p className="mb-0 text-sm text-muted">No active admins available.</p>}
                </div>
                <div className="min-w-0">
                    <label htmlFor="notification-type" className="field-label">Type</label>
                    <select id="notification-type" className="field capitalize" {...register("type")}
                        aria-invalid={!!errors.type} aria-describedby={errors.type ? "notification-type-error" : undefined}>
                        {types.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    {errorFor("type")}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="notification-title" className="field-label">Title</label>
                    <input id="notification-title" className="field" maxLength={200}
                        aria-invalid={!!errors.title} aria-describedby={errors.title ? "notification-title-error" : undefined}
                        {...register("title", { validate: (value) => !!value.trim() || "Enter a title" })} />
                    {errorFor("title")}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="notification-text" className="field-label">Message <span className="text-muted">(optional)</span></label>
                    <textarea id="notification-text" className="field" rows={3} maxLength={1000}
                        aria-invalid={!!errors.text} aria-describedby={errors.text ? "notification-text-error" : undefined}
                        {...register("text")} />
                    {errorFor("text")}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="notification-href" className="field-label">Link in Blue Tea</label>
                    <input id="notification-href" className="field" maxLength={300}
                        aria-invalid={!!errors.href} aria-describedby={errors.href ? "notification-href-error" : undefined}
                        {...register("href", { validate: (value) => /^\/(?!\/)[^\s\\]*$/.test(value.trim()) || "Enter a path such as /p-admin/orders" })} />
                    {errorFor("href")}
                </div>
            </div>
            {errors.root?.server && <p className="auth-error" role="alert">{errors.root.server.message}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-2">
                <button type="submit" className="btn btn-primary" disabled={sending || isError || !recipients.length}>
                    {sending ? "Sending…" : "Send notification"}
                </button>
                <button type="button" className="btn btn-outline" disabled={sending} onClick={onClose}>Cancel</button>
            </div>
        </form>
    )
}
