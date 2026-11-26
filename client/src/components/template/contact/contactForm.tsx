"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { contactSchema, type ContactInput } from '@/validators/contact'
import { useSendMessage } from '@/services/contact.service'
import { applyFieldErrors } from '@/utils/apiError'
import { Spinner } from '@/components/feedback/loader'

export default function ContactForm() {
    const {
        register: formRegister,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", phone: "", company: "", body: "" },
    })

    const { mutate: sendMessage, isPending } = useSendMessage(() => reset())

    const onSubmit = (data: ContactInput) => {
        sendMessage(data, { onError: (error) => applyFieldErrors(error, setError) })
    }

    return (
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                <form
                    className="flex h-full flex-col"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="mb-4">
                        <label htmlFor="name" className="field-label">Your Name</label>
                        <input type="text"
                            {...formRegister("name")}
                            className="field" id="name" autoComplete="name"
                            placeholder="Enter your name" />
                        {errors.name && <p className="auth-error">{errors.name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="field-label">Email Address</label>
                        <input type="email"
                            {...formRegister("email")}
                            className="field" id="email" autoComplete="email"
                            placeholder="Enter your email" />
                        {errors.email && <p className="auth-error">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="field-label">Phone</label>
                        <input type="tel"
                            {...formRegister("phone")}
                            className="field" id="phone" autoComplete="tel" inputMode="tel" dir="ltr"
                            placeholder="+98 912 345 6789" />
                        {!errors.phone && <p className="mt-1 text-xs text-muted">With the country code, for example +98</p>}
                        {errors.phone && <p className="auth-error">{errors.phone.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="company"
                            className="field-label">Company <span className="text-muted">(optional)</span></label>
                        <input type="text"
                            {...formRegister("company")}
                            className="field" id="company" autoComplete="organization"
                            placeholder="Enter your company name" />
                        {errors.company && <p className="auth-error">{errors.company.message}</p>}
                    </div>
                    <div className="mb-4 flex flex-1 flex-col">
                        <label htmlFor="message"
                            className="field-label">Message</label>
                        <textarea
                            {...formRegister("body")}
                            className="field min-h-32 flex-1 resize-none" id="message" rows={5}
                            maxLength={2000} placeholder="At least 10 characters"></textarea>
                        {errors.body && <p className="auth-error">{errors.body.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="auth-btn mt-auto disabled:cursor-not-allowed disabled:opacity-60">
                        {isPending ? <Spinner label="Sending" /> : "Send Message"}
                    </button>
                </form>
        </div>
    )
}
