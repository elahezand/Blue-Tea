"use client"
import Link from "next/link"
import StatusPage, { Actions, btnPrimary, btnGhost } from "@/components/feedBack/StatusPage"

export default function Error({ error, reset }) {
  return (
    <StatusPage role="alert" script="Oops, we spilled it" title="Something went wrong"
      text="We could not load this page. Try again, and if it keeps happening, come back in a few minutes.">
      {process.env.NODE_ENV !== "production" && error?.message && (
        <pre className="mb-8 max-w-full overflow-x-auto rounded-xl bg-soft px-4 py-3 text-start text-xs text-muted">{error.message}</pre>
      )}
      <Actions>
        <button type="button" onClick={() => reset()} className={btnPrimary}>Try again</button>
        <Link href="/" className={btnGhost}>Back to home</Link>
      </Actions>
    </StatusPage>
  )
}
