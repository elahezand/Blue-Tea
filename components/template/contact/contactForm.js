"use client"
import React from 'react'
import { usePost } from '@/utils/hooks/useReactQueryPublic'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { contactValidationSchema } from '@/validators/contact'
export default function ContactForm() {
    // React Hook Form setup
    const {
        register: formRegister,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(contactValidationSchema),
    })

    const { mutate, isPending } = usePost("/contact", {
        onSuccess: () => {
            toast.success("Message sent. We will reply within a day.")
            reset()
        },
        onError: () => toast.error("Could not send your message. Please try again."),
    })

    const onSubmit = async (data) => mutate(data)

    return (
        <div className="rounded-3xl border-2 border-dashed border-line bg-surface p-6 sm:p-8">
                <form
                    className="flex h-full flex-col"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="mb-4">
                        <label htmlFor="name" className="field-label">Your Name</label>
                        <input type="text"
                            {...formRegister("name")}
                            className="field" id="name"
                            placeholder="Enter your name" />
                        {errors.name && <p className="auth-error">{errors.name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="field-label">Email Address</label>
                        <input type="email"
                            {...formRegister("email")}
                            className="field" id="email"
                            placeholder="Enter your email" />
                        {errors.email && <p className="auth-error">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="field-label">Phone</label>
                        <input type="tel"
                            {...formRegister("phone")}
                            className="field"
                            id="phone" placeholder="Enter your Phone Number" />
                        {errors.phone && <p className="auth-error">{errors.phone.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="company"
                            className="field-label">Company</label>
                        <input type="text"
                            {...formRegister("company")}
                            className="field" id="company"
                            placeholder="Enter your Company Name" />
                    </div>
                    <div className="mb-4 flex flex-1 flex-col">
                        <label htmlFor="message"
                            className="field-label">Message</label>
                        <textarea
                            {...formRegister("body")}
                            className="field min-h-32 flex-1 resize-none" id="message" rows="5"
                            placeholder="Your message"></textarea>
                        {errors.body && <p className="auth-error">{errors.body.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="auth-btn mt-auto disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending}>{isPending ? "Sending..." : "Send Message"}</button>
                </form>
        </div>
    )
}
