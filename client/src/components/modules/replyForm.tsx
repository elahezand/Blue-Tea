"use client"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/feedback/loader"
import { replySchema, type ReplyInput } from "@/validators/reply"

interface ReplyFormProps {
    id: string
    label: string
    placeholder?: string
    submitLabel: string
    isPending: boolean
    onSend: (body: string, done: () => void) => void
    onCancel?: () => void
}

export default function ReplyForm({ id, label, placeholder, submitLabel, isPending, onSend, onCancel }: ReplyFormProps) {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ReplyInput>({
        resolver: zodResolver(replySchema),
        defaultValues: { body: "" },
    })
    const length = useWatch({ control, name: "body" }).length

    return (
        <form noValidate onSubmit={handleSubmit(({ body }) => onSend(body, () => reset()))}>
            <label htmlFor={id} className="field-label !text-xs">{label}</label>
            <textarea id={id} rows={4} maxLength={2000} {...register("body")} placeholder={placeholder}
                aria-invalid={!!errors.body} className="field mb-2 resize-y" />
            {errors.body && <p role="alert" className="auth-error !mt-0 mb-2">{errors.body.message}</p>}
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted">{length}/2000</span>
                <div className="flex gap-2">
                    {onCancel && <button type="button" onClick={onCancel} className="btn-ghost !h-9">Cancel</button>}
                    <button type="submit" disabled={isPending} className="classic">{isPending ? <Spinner label="Sending" /> : submitLabel}</button>
                </div>
            </div>
        </form>
    )
}
