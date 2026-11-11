"use client"
import { useState } from "react"
import toast, { type Toast } from "react-hot-toast"

export interface SwalOptions {
    title?: string
    text?: string
    icon?: "success" | "error" | "warning" | "info"
    buttons?: string | string[]
    button?: string
    content?: "input"
}

export type SwalResult = true | string | null

const btn = "h-9 cursor-pointer rounded-full border-0 px-5 text-sm font-medium transition hover:brightness-95"

interface CardProps {
    t: Toast
    title: string
    text: string
    input: boolean
    okLabel: string
    cancelLabel: string | null
    done: (value: SwalResult) => void
}

function Card({ t, title, text, input, okLabel, cancelLabel, done }: CardProps) {
    const [value, setValue] = useState("")
    const close = (v: SwalResult) => { toast.dismiss(t.id); done(v) }
    return (
        <div role="alertdialog" aria-label={title}
            className={`w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-solid border-line bg-surface p-4 text-fg shadow-xl transition-opacity duration-200 ${t.visible ? "opacity-100" : "opacity-0"}`}>
            {title && <p className="m-0 break-words text-sm font-semibold">{title}</p>}
            {text && <p className="mb-0 mt-1 break-words text-sm text-muted">{text}</p>}
            {input && (
                <textarea autoFocus rows={3} value={value} onChange={(e) => setValue(e.target.value)}
                    className="mt-3 w-full resize-none rounded-xl border border-solid border-line bg-canvas p-2 text-sm text-fg outline-none focus:border-brown" />
            )}
            <div className="mt-3 flex justify-end gap-2">
                {cancelLabel && <button type="button" onClick={() => close(null)} className={`${btn} bg-soft text-fg`}>{cancelLabel}</button>}
                <button type="button" onClick={() => close(input ? (value.trim() || null) : true)} className={`${btn} bg-brown !text-white`}>{okLabel}</button>
            </div>
        </div>
    )
}

export default function swal(opts: SwalOptions = {}): Promise<SwalResult> {
    return new Promise<SwalResult>((resolve) => {
        if (typeof document === "undefined") return resolve(null)
        const { title = "", text = "", content, icon } = opts
        const raw = opts.buttons ?? opts.button
        const labels = Array.isArray(raw) ? raw : [raw || "OK"]
        const cap = (s: string) => String(s).charAt(0).toUpperCase() + String(s).slice(1)
        const cancelLabel = labels.length > 1 ? cap(labels[0]) : null
        const okLabel = cap(labels[labels.length - 1])
        const input = content === "input"

        if (!cancelLabel && !input) {
            const msg = text ? (title ? `${title}: ${text}` : text) : title
            const fn = icon === "success" ? toast.success : icon === "error" ? toast.error : toast
            fn(msg, { duration: 6000 })
            return resolve(true)
        }
        toast.custom((t) => <Card t={t} title={title} text={text} input={input} okLabel={okLabel} cancelLabel={cancelLabel} done={resolve} />,
            { duration: Infinity, position: "top-center" })
    })
}
