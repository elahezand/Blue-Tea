"use client"
import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { MdSearch, MdClose, MdFilterAltOff } from "react-icons/md"

/*
  Search and filter bar for an admin table. It only writes the URL (?q=...&status=...&from=...&to=...),
  and resets to page 1. The server page reads those params.

  fields: [
    { type: "search", name: "q", placeholder: "Search name or email" },
    { type: "select", name: "status", label: "Status", options: ["Pending", { value: "x", label: "X" }] },
    { type: "date",   name: "date",   label: "Created", keys: ["from", "to"] },
    { type: "range",  name: "price",  label: "Price", prefix: "$", keys: ["min", "max"] },
  ]
*/
const norm = (o) => (typeof o === "string" ? { value: o, label: o } : o)
const keysOf = (f) => (f.type === "search" || f.type === "select" ? [f.name] : f.keys || (f.type === "date" ? ["from", "to"] : ["min", "max"]))
const day = (v) => new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short" })

export default function TableToolbar({ fields = [], count }) {
    const router = useRouter()
    const pathname = usePathname()
    const sp = useSearchParams()
    const [pending, start] = useTransition()
    const get = (k) => sp.get(k) || ""
    const searchField = fields.find((f) => f.type === "search")
    const [text, setText] = useState(searchField ? get(searchField.name) : "")

    const push = (changes) => {
        const q = new URLSearchParams(sp.toString())
        Object.entries(changes).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)))
        q.delete("page")
        start(() => router.push(`${pathname}${q.toString() ? `?${q}` : ""}`, { scroll: false }))
    }
    const submit = (e) => { e.preventDefault(); if (searchField) push({ [searchField.name]: text.trim() }) }
    const clearKeys = (keys) => { if (keys.includes(searchField?.name)) setText(""); push(Object.fromEntries(keys.map((k) => [k, ""]))) }
    const resetAll = () => { setText(""); push(Object.fromEntries(fields.flatMap(keysOf).map((k) => [k, ""]))) }

    // Chips for what is active right now
    const chips = fields.flatMap((f) => {
        const ks = keysOf(f)
        if (f.type === "search" || !ks.some(get)) return f.type === "search" && get(f.name) ? [{ key: f.name, keys: ks, label: `“${get(f.name)}”` }] : []
        if (f.type === "select") return [{ key: f.name, keys: ks, label: `${f.label}: ${(f.options.map(norm).find((o) => o.value === get(f.name)) || { label: get(f.name) }).label}` }]
        if (f.type === "date") return [{ key: f.name, keys: ks, label: `${f.label}: ${get(ks[0]) ? day(get(ks[0])) : "…"} to ${get(ks[1]) ? day(get(ks[1])) : "…"}` }]
        return [{ key: f.name, keys: ks, label: `${f.label}: ${get(ks[0]) ? `${f.prefix || ""}${get(ks[0])}` : "…"} to ${get(ks[1]) ? `${f.prefix || ""}${get(ks[1])}` : "…"}` }]
    })
    const control = "field field-sm !h-10"

    return (
        <div className={`admin-card p-4 transition-opacity ${pending ? "opacity-70" : ""}`} role="search">
            <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
                {searchField && (
                    <div className="flex min-w-[15rem] flex-1 items-center gap-2 rounded-full border border-solid border-line bg-surface py-1 pr-1 pl-4 focus-within:border-brown focus-within:ring-4 focus-within:ring-brown/15">
                        <MdSearch aria-hidden className="shrink-0 text-xl text-muted" />
                        <input type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder={searchField.placeholder || "Search"} aria-label={searchField.placeholder || "Search"}
                            className="min-w-0 flex-1 border-none bg-transparent py-1.5 text-sm text-fg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden" />
                        <button type="submit" className="btn-organic shrink-0 bg-brown px-5 py-1.5 text-sm font-medium !text-white">Search</button>
                    </div>
                )}
                {fields.filter((f) => f.type !== "search").map((f) => {
                    const ks = keysOf(f)
                    return (
                        <div key={f.name} className={f.type === "select" ? "w-[calc(50%-0.375rem)] sm:w-40" : "w-full sm:w-auto"}>
                            <label className="field-label !mb-1 !text-xs" htmlFor={`f-${f.name}`}>{f.label}</label>
                            {f.type === "select" && (
                                <select id={`f-${f.name}`} value={get(f.name)} onChange={(e) => push({ [f.name]: e.target.value })} className={control}>
                                    <option value="">All</option>
                                    {f.options.map(norm).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            )}
                            {f.type === "date" && (
                                <div className="flex items-center gap-2">
                                    <input id={`f-${f.name}`} type="date" aria-label={`${f.label} from`} value={get(ks[0])} max={get(ks[1]) || undefined} onChange={(e) => push({ [ks[0]]: e.target.value })} className={`${control} sm:w-40`} />
                                    <span aria-hidden className="text-muted">to</span>
                                    <input type="date" aria-label={`${f.label} to`} value={get(ks[1])} min={get(ks[0]) || undefined} onChange={(e) => push({ [ks[1]]: e.target.value })} className={`${control} sm:w-40`} />
                                </div>
                            )}
                            {f.type === "range" && (
                                <div className="flex items-center gap-2">
                                    {[0, 1].map((i) => (
                                        <input key={i} id={i ? undefined : `f-${f.name}`} type="number" min="0" inputMode="decimal" placeholder={i ? "Max" : "Min"} aria-label={`${f.label} ${i ? "max" : "min"}`}
                                            defaultValue={get(ks[i])} onBlur={(e) => e.target.value !== get(ks[i]) && push({ [ks[i]]: e.target.value })}
                                            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} className={`${control} w-full sm:w-24`} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </form>
            {(chips.length > 0 || count != null) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dotted border-line pt-3">
                    {count != null && <span className="me-2 text-sm text-muted">{count} result{count === 1 ? "" : "s"}</span>}
                    {chips.map((c) => (
                        <button key={c.key} type="button" onClick={() => clearKeys(c.keys)} aria-label={`Remove filter ${c.label}`}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-solid border-line bg-soft px-3 py-1 text-xs font-medium text-fg hover:border-brown/50">
                            {c.label}<MdClose aria-hidden className="text-sm text-muted" />
                        </button>
                    ))}
                    {chips.length > 0 && (
                        <button type="button" onClick={resetAll} className="ms-auto inline-flex cursor-pointer items-center gap-1 border-none bg-transparent text-xs font-medium text-link hover:underline">
                            <MdFilterAltOff aria-hidden />Clear all
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
