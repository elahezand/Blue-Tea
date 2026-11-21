"use client"
import { useState } from "react"
import useIsClient from "@/hooks/useIsClient"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Reveal, Stagger, Item } from "@/components/modules/motion"
import { SHOP, openStatus } from "@/components/modules/shopInfo"
import { TableScene } from "@/components/modules/illustrations"
import { MdCheckCircle, MdOutlineDirections } from "react-icons/md"
import { Spinner } from "@/components/feedback/loader"
import { useBookTable } from "@/services/reservation.service"
import { applyFieldErrors } from "@/utils/apiError"
import { reservationSchema, type ReservationInput } from "@/validators/reservation"

const EMPTY: ReservationInput = { name: "", email: "", phone: "", date: "", time: "", guests: 2, notes: "" }

export default function Reservation() {
  const [booked, setBooked] = useState<ReservationInput | null>(null)
  const isClient = useIsClient()
  const status = isClient ? openStatus() : null

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: EMPTY,
  })

  const { mutate: bookTableRequest, isPending } = useBookTable((booking) => {
    reset(EMPTY)
    setBooked(booking)
  })

  const bookTable = (data: ReservationInput) => {
    bookTableRequest(data, { onError: (error) => applyFieldErrors(error, setError) })
  }

  const err = (name: keyof ReservationInput) =>
    errors[name] && <p className="auth-error" role="alert">{errors[name]?.message}</p>

  const today = new Date().toISOString().slice(0, 10)

  return (
    <section id="reservation" className="band">
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal x={-30} y={0} className="lg:col-span-5">
          <TableScene className="mb-8 aspect-[2/1] w-full max-w-md rounded-2xl" />
          <span className="script -rotate-2 inline-block text-3xl text-[var(--lamp)]">Saving a table?</span>
          <h2 className="mb-3 text-4xl text-fg">Book a table</h2>
          <p className="mb-8 max-w-sm text-muted">Tables seat up to 5. Pick a day and time and we will confirm by email.</p>

          <Stagger as="ul" gap={0.08} delay={0.2} className="m-0 mb-5 max-w-md list-none border-0 border-t border-line p-0 text-sm">
            {SHOP.hours.map((h) => (
              <Item as="li" y={10} key={h.days} className="flex justify-between gap-4 border-0 border-b border-line py-2.5">
                <span className="text-muted">{h.days}</span>
                <span className="font-medium text-fg">{h.time}</span>
              </Item>
            ))}
          </Stagger>

          {status && (
            <p className="mb-2 flex items-center gap-2 text-sm text-muted">
              <span aria-hidden className={`size-2 rounded-full ${status.open ? "bg-[#6fcf97]" : "bg-muted"}`} />
              {status.text}
            </p>
          )}

          <p className="m-0 flex flex-wrap items-center gap-x-4 text-sm text-muted">
            Prefer to call?{" "}
            <a className="inline-block py-2 font-medium text-link underline underline-offset-4" href={SHOP.phoneHref}>{SHOP.phone}</a>
            <a
              className="inline-flex items-center gap-1 py-2 font-medium text-link underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP.address)}`}
            >
              <MdOutlineDirections aria-hidden />
              Get directions
            </a>
          </p>
        </Reveal>

        <Reveal x={30} y={0} delay={0.1} className="lg:col-span-7">
          <div className="rounded-3xl bg-surface p-7 text-fg shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] sm:p-10">
            {booked ? (
              <div className="flex flex-col items-center py-6 text-center" role="status">
                <MdCheckCircle className="mb-4 text-6xl text-[var(--green)]" aria-hidden />
                <h3 className="mb-2 text-3xl text-fg">You are booked</h3>
                <p className="mb-6 max-w-sm text-muted">We sent a confirmation to {booked.email || "your email"}. Show this at the counter if you like.</p>
                <dl className="mb-8 grid w-full max-w-sm grid-cols-2 gap-px overflow-hidden rounded-2xl border border-solid border-line bg-line text-start text-sm">
                  {[["Name", booked.name], ["Guests", String(booked.guests)], ["Date", booked.date], ["Time", booked.time]].map(([k, v]) => (
                    <div key={k} className="bg-surface px-4 py-3">
                      <dt className="text-muted">{k}</dt>
                      <dd className="m-0 font-medium text-fg">{v || "-"}</dd>
                    </div>
                  ))}
                </dl>
                <button type="button" onClick={() => setBooked(null)} className="btn btn-outline">Book another table</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(bookTable)} className="flex flex-col">
                <h3 className="mb-1 text-2xl text-fg">Your table</h3>
                <p className="mb-7 text-sm text-muted">A few details and we will save you a seat.</p>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-6">
                  <div className="col-span-2 sm:col-span-6">
                    <label htmlFor="res-name" className="field-label">Name</label>
                    <input autoComplete="name" type="text" id="res-name" {...register("name")} aria-invalid={!!errors.name} className="field" />
                    {err("name")}
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <label htmlFor="res-email" className="field-label">Email</label>
                    <input type="email" autoComplete="email" id="res-email" {...register("email")} aria-invalid={!!errors.email} className="field" />
                    {err("email")}
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <label htmlFor="res-phone" className="field-label">Phone</label>
                    <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+14155550123" maxLength={20} id="res-phone" {...register("phone")} aria-invalid={!!errors.phone} className="field" />
                    {err("phone")}
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label htmlFor="res-date" className="field-label">Date</label>
                    <input type="date" id="res-date" {...register("date")} min={today} aria-invalid={!!errors.date} className="field" />
                    {err("date")}
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="res-time" className="field-label">Time</label>
                    <input className="field" id="res-time" {...register("time")} type="time" step="300" min="08:00" max="23:00" aria-invalid={!!errors.time} />
                    {err("time")}
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="res-guests" className="field-label">Guests</label>
                    <input type="number" id="res-guests" {...register("guests", { valueAsNumber: true })} className="field" min={1} max={5} aria-invalid={!!errors.guests} />
                    {err("guests")}
                  </div>
                  <div className="col-span-2 sm:col-span-6">
                    <label htmlFor="res-notes" className="field-label">Notes (optional)</label>
                    <textarea {...register("notes")} id="res-notes" rows={3} className="field resize-none" placeholder="Allergies, a birthday, a high chair" />
                  </div>
                </div>
                <button type="submit" disabled={isPending} className="auth-btn disabled:cursor-wait disabled:opacity-70">
                  {isPending ? <Spinner label="Booking" /> : "Book table"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}