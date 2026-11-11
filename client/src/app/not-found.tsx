import Link from "next/link"
import StatusPage, { Actions, btnPrimary, btnGhost } from "@/components/feedback/statusPage"

export const metadata = { title: "Page not found | Blue Tea" }

export default function NotFound() {
  return (
    <StatusPage code="404" script="Nothing in this cup" title="We could not find that page"
      text="The link may be old or mistyped. Try the menu, the store, or head back home.">
      <Actions>
        <Link href="/" className={btnPrimary}>Back to home</Link>
        <Link href="/products" className={btnGhost}>Browse the store</Link>
      </Actions>
    </StatusPage>
  )
}
