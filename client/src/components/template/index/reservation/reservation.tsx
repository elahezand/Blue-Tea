"use client"
import { useState } from "react"
import useIsClient from "@/hooks/useIsClient"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SectionHeader } from "@/components/modules/motion"
import { TableScene } from "@/components/modules/illustrations"
import { SHOP, SHOP_DIRECTIONS_URL, openStatus, reservationLocalTime, reservationSlots } from "@/components/modules/shopInfo"
import { MdCheckCircle, MdOutlineAccessTime, MdOutlineDirections, MdOutlinePhone } from "react-icons/md"
import { Spinner } from "@/components/feedback/loader"
import { useBookTable } from "@/services/reservation.service"
import type { Reservation as Booking } from "@/types/reservation"
import { applyFieldErrors } from "@/utils/apiError"
import { reservationSchema, type ReservationInput } from "@/validators/reservation"

const EMPTY: ReservationInput = { name: "", email: "", phone: "", date: "", time: "", guests: 2, notes: "" }

const errId = (name: keyof ReservationInput) => `res-${name}-error`

const legendClass = "mb-4 flex items-center gap-3 font-display text-lg font-medium text-fg"
const legendNumber = "flex size-7 shrink-0 items-center justify-center rounded-full bg-brown/10 font-body text-xs font-semibold text-link"

export default function Reservation() {
  const [booked, setBooked] = useState<Booking | null>(null)
  const [now] = useState(() => reservationLocalTime(new Date()))
  const isClient = useIsClient()
  const status = isClient ? openStatus() : null

  const { register, handleSubmit, control, getValues, setValue, reset, setError, formState: { errors } } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: EMPTY,
  })
  const date = useWatch({ control, name: "date" })
  const slots = reservationSlots(date, now)

  const { mutate: bookTableRequest, isPending } = useBookTable((booking) => {
    reset(EMPTY)
    setBooked(booking)
  })

  const bookTable = (data: ReservationInput) => {
    bookTableRequest(data, { onError: (error) => applyFieldErrors(error, setError) })
  }

  const err = (name: keyof ReservationInput) =>
    errors[name] && (
      <p id={errId(name)} className="mt-1.5 text-sm text-berry" role="alert">
        {errors[name]?.message}
      </p>
    )

  return (
    <section id="reservation" aria-labelledby="reservation-title" className="scroll-mt-20 bg-canvas !py-16 lg:!py-24">
      <div className="container">
        <SectionHeader
          titleId="reservation-title"
          script="Saving a table?"
          title="Book a table"
          text="Choose a date and time for up to five guests."
          className="mb-10 sm:mb-14"
        />

        <div className="snow-cap mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-solid border-line bg-surface shadow-[0_30px_60px_-40px_rgba(20,41,90,0.35)] lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
          <div className="min-w-0 p-6 sm:p-10">
            {booked ? (
              <div className="flex flex-col items-center py-10 text-center" role="status">
                <span className="mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--green)]/15 text-4xl text-[var(--green)]">
                  <MdCheckCircle aria-hidden />
                </span>
                <h3 className="mb-2 text-3xl text-fg">Reservation requested</h3>
                <p className="mb-8 max-w-sm text-muted">
                  Your request is waiting for confirmation from the café.
                </p>
                <dl className="mb-10 grid w-full max-w-sm grid-cols-2 gap-px overflow-hidden rounded-2xl border border-solid border-line bg-line text-start text-sm">
                  {[["Name", booked.name], ["Guests", String(booked.guests)], ["Date", booked.date], ["Time", booked.time]].map(([k, v]) => (
                    <div key={k} className="bg-surface px-5 py-4">
                      <dt className="text-muted">{k}</dt>
                      <dd className="m-0 mt-0.5 font-medium text-fg">{v || "-"}</dd>
                    </div>
                  ))}
                </dl>
                <button type="button" onClick={() => setBooked(null)} className="btn btn-outline">
                  Book another table
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(bookTable)} className="flex flex-col gap-9" noValidate>
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <legend className={legendClass}>
                    <span aria-hidden className={legendNumber}>1</span>
                    Your visit
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="min-w-0 sm:col-span-1">
                      <label htmlFor="res-date" className="field-label">Date</label>
                      <input
                        type="date"
                        id="res-date"
                        min={now.date}
                        {...register("date", {
                          onChange: (event) => {
                            if (!reservationSlots(event.target.value, now).includes(getValues("time"))) setValue("time", "")
                          },
                        })}
                        aria-invalid={!!errors.date}
                        aria-describedby={errors.date ? errId("date") : undefined}
                        className="field"
                      />
                      {err("date")}
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="res-time" className="field-label">Time</label>
                      <select
                        id="res-time"
                        {...register("time")}
                        disabled={!slots.length}
                        aria-invalid={!!errors.time}
                        aria-describedby={errors.time ? errId("time") : undefined}
                        className="field"
                      >
                        <option value="">{!date ? "Choose a date first" : slots.length ? "Choose a time" : "No booking times"}</option>
                        {slots.map((time) => <option key={time} value={time}>{time}</option>)}
                      </select>
                      {err("time")}
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="res-guests" className="field-label">Guests</label>
                      <input
                        id="res-guests"
                        type="number"
                        min={1}
                        max={5}
                        {...register("guests", { valueAsNumber: true })}
                        aria-invalid={!!errors.guests}
                        aria-describedby={errors.guests ? errId("guests") : undefined}
                        className="field"
                      />
                      {err("guests")}
                    </div>
                  </div>
                </fieldset>

                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <legend className={legendClass}>
                    <span aria-hidden className={legendNumber}>2</span>
                    Contact details
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="res-name" className="field-label">Name</label>
                      <input
                        id="res-name"
                        type="text"
                        autoComplete="name"
                        {...register("name")}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? errId("name") : undefined}
                        className="field"
                      />
                      {err("name")}
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="res-email" className="field-label">Email</label>
                      <input
                        id="res-email"
                        type="email"
                        autoComplete="email"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? errId("email") : undefined}
                        className="field"
                      />
                      {err("email")}
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="res-phone" className="field-label">Phone</label>
                      <input
                        id="res-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+14155550123"
                        maxLength={20}
                        {...register("phone")}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? errId("phone") : undefined}
                        className="field"
                      />
                      {err("phone")}
                    </div>
                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="res-notes" className="field-label">Notes (optional)</label>
                      <textarea
                        id="res-notes"
                        rows={3}
                        maxLength={300}
                        {...register("notes")}
                        placeholder="Allergies, a birthday, a high chair"
                        className="field resize-none"
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="flex flex-col gap-3 border-0 border-t border-solid border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0 text-xs text-muted">Check your account for confirmation.</p>
                  <button type="submit" disabled={isPending} className="btn btn-primary min-h-12 w-full sm:w-auto disabled:cursor-wait">
                    {isPending ? <Spinner label="Booking" /> : "Request reservation"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside
            aria-labelledby="reservation-hours"
            className="flex min-w-0 flex-col gap-6 border-0 border-t border-solid border-line bg-soft/60 p-6 sm:p-10 lg:border-t-0 lg:border-l"
          >
            <div>
              <h3 id="reservation-hours" className="mb-2 flex items-center gap-2 font-display text-xl text-fg">
                <MdOutlineAccessTime aria-hidden className="shrink-0 text-link" />
                Opening hours
              </h3>
              {status && (
                <p className="m-0 flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden className={`size-2 shrink-0 rounded-full ${status.open ? "bg-[var(--green)]" : "bg-muted"}`} />
                  {status.text}
                </p>
              )}
            </div>

            <dl className="m-0 divide-y divide-line rounded-2xl bg-surface px-5 text-sm">
              {SHOP.hours.map(({ days, time }) => (
                <div key={days} className="flex flex-wrap justify-between gap-x-3 gap-y-1 py-3">
                  <dt className="text-muted">{days}</dt>
                  <dd className="m-0 whitespace-nowrap font-medium text-fg">{time}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-1 text-sm">
              <a className="inline-flex min-h-11 items-center gap-2 font-medium text-link no-underline hover:underline" href={SHOP.phoneHref}>
                <MdOutlinePhone aria-hidden />
                {SHOP.phone}
              </a>
              <a
                className="inline-flex min-h-11 items-center gap-2 font-medium text-link no-underline hover:underline"
                target="_blank"
                rel="noreferrer"
                href={SHOP_DIRECTIONS_URL}
              >
                <MdOutlineDirections aria-hidden />
                Get directions
              </a>
            </div>

            <TableScene className="mt-auto hidden aspect-[2/1] w-full rounded-xl lg:block" />
          </aside>
        </div>
      </div>
    </section>
  )
}
