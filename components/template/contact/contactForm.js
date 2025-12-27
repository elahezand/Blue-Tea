"use client"
import React from 'react'
import { usePost } from '@/utils/hooks/useReactQueryPublic'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import styles from "@/styles/contact-us.module.css"
import toast from 'react-hot-toast'
import { contactValidationSchema } from '@/validators/contact'
export default function ContactForm() {
    // React Hook Form setup
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(contactValidationSchema),
    })

    const { mutate } = usePost("/contact", {
        onSuccess: () => {
            toast.success("your Message Sent Successfully :)")
        },
    })

    const onSubmit = async (data) => mutate(data)

    return (
        <div className={styles.form_group}>
            <div className={styles.contact_form}>
                <form
                    className={styles.login_form}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input type="text"
                            {...formRegister("name")}
                            className="form-control" id="name"
                            placeholder="Enter your name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email"
                            {...formRegister("email")}
                            className="form-control" id="email"
                            placeholder="Enter your email" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="text"
                            {...formRegister("phone")}
                            className="form-control"
                            id="email" placeholder="Enter your Phone Number" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="company"
                            className="form-label">Company</label>
                        <input type="text"
                            {...formRegister("company")}
                            className="form-control" id="email"
                            placeholder="Enter your Company Name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea
                            {...formRegister("body")}
                            className="form-control" id="message" rows="5"
                            placeholder="Your message"></textarea>
                    </div>
                    <button
                        type="submit"
                        className={`${styles.btn}`}>Send Message</button>
                </form>
            </div>
        </div>
    )
}
