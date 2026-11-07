"use client"
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Reveal, Stagger, Item } from '@/components/modules/motion'
import { SHOP, openStatus } from '@/components/modules/shopInfo'
import { TableScene } from '@/components/modules/illustrations'
import { MdCheckCircle, MdOutlineDirections } from 'react-icons/md'

type Booking = Partial<Record<"name" | "email" | "phone" | "guests" | "notes" | "date" | "time", string>>


export default function Reservation() {
  const formRef = useRef<HTMLFormElement>(null)
  const lastValues = useRef<Booking | null>(null)
  const [booked, setBooked] = useState<Booking | null>(null)
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(null)
  useEffect(() => { setStatus(openStatus()) }, [])
  const bookTable = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    lastValues.current = Object.fromEntries(new FormData(e.currentTarget)) as Booking
    // TODO: book-table request (removed for now): POST /reservation with the form data.
    // On success: toast + formRef.current?.reset() + setBooked(lastValues.current)
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <section id="reservation">
      <div className="container">
        <Reveal className="grid overflow-hidden rounded-3xl border-2 border-dashed border-line bg-surface p-3 lg:grid-cols-12">
          <Reveal x={-40} y={0} className="flex flex-col overflow-hidden rounded-2xl bg-[var(--navy)] text-white lg:col-span-5">
            <TableScene className="aspect-[2/1] w-full lg:aspect-[16/7]" />
            <div className="flex flex-1 flex-col p-8 lg:px-10 lg:py-8">
              <span className="script -rotate-2 inline-block text-3xl text-[var(--lamp)]">Saving a table?</span>
              <h2 className="mb-3 text-3xl !text-white">Book a table</h2>
              <p className="mb-6 max-w-xs text-white/80">Tables seat up to 5. Pick a day and time and we will confirm by email.</p>
              <h3 className="mb-3 font-body text-sm font-semibold !text-white">Opening hours</h3>
              <Stagger as="ul" gap={0.08} delay={0.3} className="m-0 mb-5 list-none p-0 text-sm">
                {SHOP.hours.map((h, i) => (
                  <Item as="li" y={10} key={h.days} className={`flex justify-between gap-4 py-2 ${i < SHOP.hours.length - 1 ? "border-b border-white/20" : ""}`}>
                    <span className="text-white/75">{h.days}</span><span className="font-medium">{h.time}</span>
                  </Item>
                ))}
              </Stagger>
              {status && <p className="mb-3 flex items-center gap-2 text-sm text-white/90"><span aria-hidden className={`size-2 rounded-full ${status.open ? "bg-[#6fcf97]" : "bg-white/50"}`} />{status.text}</p>}
              <p className="m-0 mt-3 flex flex-wrap items-center gap-x-4 pt-2 text-sm text-white/80">Prefer to call? <a className="inline-block py-2 font-medium text-white underline underline-offset-4" href={SHOP.phoneHref}>{SHOP.phone}</a>
                <a className="inline-flex items-center gap-1 py-2 font-medium text-white underline underline-offset-4" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.address)}`}><MdOutlineDirections aria-hidden />Get directions</a></p>
            </div>
          </Reveal>

          {booked ? (
            <Reveal x={40} y={0} className="flex flex-col items-center justify-center p-8 text-center lg:col-span-7 lg:p-10" role="status">
              <MdCheckCircle className="mb-4 text-6xl text-[var(--green)]" aria-hidden />
              <h3 className="mb-2 text-3xl text-fg">You are booked</h3>
              <p className="mb-6 max-w-sm text-muted">We sent a confirmation to {booked.email || "your email"}. Show this at the counter if you like.</p>
              <dl className="mb-8 grid w-full max-w-sm grid-cols-2 gap-px overflow-hidden rounded-2xl border border-solid border-line bg-line text-start text-sm">
                {[["Name", booked.name], ["Guests", booked.guests], ["Date", booked.date], ["Time", booked.time]].map(([k, v]) => (
                  <div key={k} className="bg-surface px-4 py-3"><dt className="text-muted">{k}</dt><dd className="m-0 font-medium text-fg">{v || "-"}</dd></div>
                ))}
              </dl>
              <button type="button" onClick={() => setBooked(null)} className="btn-organic bg-surface px-7 py-2.5 text-sm font-medium text-fg">Book another table</button>
            </Reveal>
          ) : (
          <Reveal as="form" x={40} y={0} delay={0.1} ref={formRef} onSubmit={bookTable} className="flex flex-col p-8 lg:col-span-7 lg:px-10 lg:py-8">
            <div className="mb-6 grid flex-1 grid-cols-2 content-start gap-4 sm:grid-cols-6 sm:grid-rows-[auto_auto_auto_1fr]">
              <div className="col-span-2 sm:col-span-6"><label htmlFor="res-name" className="field-label">Name</label><input autoComplete="name" type="text" id="res-name" name="name" className="field" required /></div>
              <div className="col-span-2 sm:col-span-3"><label htmlFor="res-email" className="field-label">Email</label><input type="email" autoComplete="email" id="res-email" name="email" className="field" required /></div>
              <div className="col-span-2 sm:col-span-3"><label htmlFor="res-phone" className="field-label">Phone</label><input type="tel" autoComplete="tel" id="res-phone" name="phone" className="field" required /></div>
              <div className="col-span-2 sm:col-span-2"><label htmlFor="res-date" className="field-label">Date</label><input type="date" id="res-date" name="date" min={today} className="field" required /></div>
              <div className="col-span-1 sm:col-span-2"><label htmlFor="res-time" className="field-label">Time</label><input className="field" id="res-time" name="time" type="time" step="300" min="08:00" max="23:00" required /></div>
              <div className="col-span-1 sm:col-span-2"><label htmlFor="res-guests" className="field-label">Guests</label><input type="number" id="res-guests" name="guests" className="field" min={1} max={5} defaultValue={2} required /></div>
              <div className="col-span-2 flex flex-col sm:col-span-6"><label htmlFor="res-notes" className="field-label">Notes (optional)</label><textarea name="notes" id="res-notes" rows={4} className="field min-h-28 flex-1 resize-none" placeholder="Allergies, a birthday, a high chair"></textarea></div>
            </div>
            <button type="submit" className="auth-btn mt-auto">
              Book table
            </button>
          </Reveal>
          )}
        </Reveal>
      </div>
    </section>
  )
}