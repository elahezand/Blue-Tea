import nodemailer from "nodemailer"
import { MAIL_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../config/env.js"
import { AppError } from "./AppError.js"

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
})

export const sendMail = async (to: string, subject: string, text: string) => {
    if (!SMTP_HOST) throw new AppError("Email is not set up on the server", 503)
    try {
        await transporter.sendMail({ from: MAIL_FROM, to, subject, text })
    } catch {
        throw new AppError("Couldn't send the email. Please try again.", 502)
    }
}