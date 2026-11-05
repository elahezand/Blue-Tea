"use client"
import React from "react"
import StatusPage, { Actions, btnPrimary } from "@/components/feedBack/StatusPage"

export default function ErrorPage({ error, reset }) {
  return (
    <StatusPage role="alert" script="Oops, we spilled it" title="Something went wrong"
      text={error?.message || "An unexpected error occurred."}>
      <Actions>
        <button type="button" onClick={() => reset()} className={btnPrimary}>Try again</button>
      </Actions>
    </StatusPage>
  )
}
