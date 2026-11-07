"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { contactValidationSchema, type ContactInput } from '@/validators/contact'
export default function ContactForm() {
    // React Hook Form setup
    const {
        register: formRegister,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactValidationSchema),
    })

    const onSubmit = (data: ContactInput) => {
        // TODO: send-message request (removed for now), payload: data. On success: toast + reset()
        void data
        void reset
    }

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
                            className="field min-h-32 flex-1 resize-none" id="message" rows={5}
                            placeholder="Your message"></textarea>
                        {errors.body && <p className="auth-error">{errors.body.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="auth-btn mt-auto disabled:cursor-not-allowed disabled:opacity-60">Send Message</button>
                </form>
        </div>
    )
}
