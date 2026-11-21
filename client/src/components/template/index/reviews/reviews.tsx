import type { Comment } from "@/types/comment"
import { SectionHeader, Stagger, Item } from '@/components/modules/motion'

// Clean, but in the site's own language: the big quote on the navy board (like the menu),
// two quiet white cards under it, lamp-yellow details.
function Stars({ n, tone = "text-[#c98a2b]", className = "" }: { n: number; tone?: string; className?: string }) {
  const k = Math.round(n)
  return (
    <span className={`inline-flex gap-0.5 text-sm tracking-[0.15em] ${tone} ${className}`} role="img" aria-label={`${n} out of 5 stars`}>
      <span aria-hidden>{"★".repeat(k)}<span className="opacity-30">{"★".repeat(5 - k)}</span></span>
    </span>
  )
}

function Who({ c, dark = false }: { c: Comment; dark?: boolean }) {
  const date = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : null
  return (
    <figcaption className="flex items-center gap-3 text-sm">
      <span aria-hidden className={`flex size-9 items-center justify-center rounded-full font-medium ${dark ? "bg-[var(--lamp)] text-[var(--navy)]" : "bg-[var(--navy)] text-[var(--cream)]"}`}>
        {(c.username || "?").charAt(0).toUpperCase()}
      </span>
      <span className="leading-tight">
        <span className={`block font-medium ${dark ? "text-[var(--cream)]" : "text-fg"}`}>{c.username}</span>
        {date && <span className={`text-xs ${dark ? "text-[var(--cream)]/60" : "text-muted"}`}>{date}</span>}
      </span>
    </figcaption>
  )
}

export default function Reviews({ comments = [] }: { comments?: Comment[] }) {
  const good = comments.filter(c => typeof c.score === "number" && c.score >= 4).slice(0, 3)
  if (!good.length) return null
  const [lead, ...rest] = good
  const rated = comments.filter(c => typeof c.score === "number")
  const avg = rated.reduce((t, c) => t + c.score, 0) / (rated.length || 1)
  return (
    <section id="reviews" className="band">
      <div className="container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(50vh-8rem)]">
            <SectionHeader align="start" script="Kind words" title="What customers say" text="A few words from people who stopped by." className="!mb-8" />
            <div className="flex items-end gap-4">
              <span className="font-display text-6xl leading-[0.8] font-semibold" style={{ color: "var(--head)" }}>{avg.toFixed(1)}</span>
              <span className="flex flex-col gap-1 pb-0.5">
                <Stars n={avg} />
                <span className="text-sm text-muted">{rated.length} recent {rated.length === 1 ? "review" : "reviews"}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-8">
          <figure className="board m-0 mb-6 p-8 sm:p-12">
            <span aria-hidden className="block font-display text-7xl leading-[0.5] text-[var(--lamp)]">“</span>
            <blockquote className="m-0 mt-4 mb-8 font-display text-2xl leading-snug text-[var(--cream)] sm:text-3xl">{lead.body}</blockquote>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Who c={lead} dark />
              <Stars n={lead.score} tone="text-[var(--lamp)]" />
            </div>
          </figure>

          {rest.length > 0 && (
            <Stagger gap={0.12} className="grid gap-6 sm:grid-cols-2">
              {rest.map((c, i) => (
                <Item key={c._id || i} as="figure" className="m-0 flex flex-col rounded-3xl bg-surface p-7 shadow-[0_18px_40px_-28px_rgba(20,41,90,0.35)]">
                  <Stars n={c.score} />
                  <blockquote className="m-0 mt-3 mb-6 flex-1 leading-relaxed text-fg">{c.body}</blockquote>
                  <Who c={c} />
                </Item>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </section>
  )
}