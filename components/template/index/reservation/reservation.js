"use client"
import React from 'react'
import { useEffect } from 'react'
import styles from "./reservation.module.css"
import { useActionState } from 'react'
import { NewReservation } from '@/utils/actions/reservationActionServer'
import { MotionDiv } from '@/utils/animate'
import toast from 'react-hot-toast'
export default function Reservation() {
  const [state, formAction] = useActionState(NewReservation, {
    message: "",
    error: undefined,
    fields: {
      name: "",
      email: "",
      phone: "",
      guests: "",
      notes: "",
      date: "",
      time: "",
    }
  })


  useEffect(() => {
    if (!state.message) return

    state.message === "success"
      ? toast.success("reservation created successfully :)")
      : toast.error("please fill required fields correctly!")
  }, [state.message])

  return (
    <>
      <div id="reservation"
        className='container'>
        <h1 className="heading">booking <span>reserve a table</span></h1>
        <MotionDiv
          initial={{ opacity: 0, y: -200 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.07 }}
          className={styles.book} id="book">
          <form action={async (formatData) => {
            await formAction(formatData)

          }}>
            <input type="text"
              placeholder="Name"
              name='name'
              className={styles.box}
              required />
            <input type="text"
              placeholder="Email"
              name='email'
              className={styles.box}
              required />
            <input type="date"
              placeholder="Date"
              name='date'
              className={styles.box}
              required />
            <input
              className={styles.box}
              name='time'
              type="time"
              step="300"
              min="08:00"
              max="23:00"
              required
            />
            <input type="text"
              placeholder="Phone"
              name='phone'
              className={styles.box} required />
            <input type="number"
              placeholder="Number of Guests"
              name='guests'
              className={styles.box}
              min={1} max={5}
              required
            />
            <textarea name="notes"
              placeholder="Message"
              className={styles.box}
              id="" cols="30" rows="10"></textarea>
            <button
              type="submit"
              className={styles.btn}
              disabled={state.pending}
            >
              {state.pending ? "sending..." : "send message"}
            </button>
          </form>
        </MotionDiv>
      </div>
    </>
  )
}
