import type { Comment } from "@/types/comment"
import { SectionHeader, Stagger, Item } from '@/components/modules/motion'

function Stars({ n, tone = "text-link" }: { n: number; tone?: string }) {
  const k = Math.round(n)
  return (
    <span className={`inline-flex gap-0.5 text-[15px] tracking-wider ${tone}`} role="img" aria-label={`${n} out of 5 stars`}>
      <span aria-hidden>{"★".repeat(k)}<span className="opacity-30">{"★".repeat(5 - k)}</span></span>
    </span>
  )
}

function Who({ c, dark = false }: { c: Comment; dark?: boolean }) {
  const date = c.date ? new Date(c.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : null
  return (
    <figcaption className="flex items-center gap-3 text-sm">
      <span aria-hidden className={`flex size-9 items-center justify-center rounded-full ${dark ? "bg-[var(--cream)]" : "bg-soft"} font-medium ${dark ? "text-[var(--navy)]" : "text-link"}`}>{(c.username || "?").charAt(0).toUpperCase()}</span>
      <span>
        <span className={`block font-medium ${dark ? "text-[var(--cream)]" : "text-fg"}`}>{c.username}</span>
        {date && <span className={dark ? "text-[var(--cream)]/65" : "text-muted"}>{date}</span>}
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
      <div className="container grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(50vh-8rem)]">
            <SectionHeader align="start" script="Kind words" title="What customers say" text="A few words from people who stopped by." className="!mb-6" />
            <div className="inline-flex items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-surface px-5 py-4">
              <span className="font-display text-4xl leading-none font-semibold text-fg">{avg.toFixed(1)}</span>
              <span className="flex flex-col gap-1">
                <Stars n={avg} />
                <span className="text-sm text-muted">from {rated.length} recent {rated.length === 1 ? "review" : "reviews"}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <figure className="board m-0 mb-5 p-7 sm:p-10">
            <span aria-hidden className="block font-display text-7xl leading-[0.6] text-[var(--lamp)]">“</span>
            <blockquote className="m-0 mt-1 mb-6 font-display text-xl leading-snug text-[var(--cream)] sm:text-2xl">{lead.body}</blockquote>
            <div className="flex flex-wrap items-center justify-between gap-3 text-[var(--cream)]">
              <Who c={lead} dark />
              <Stars n={lead.score} tone="text-[var(--lamp)]" />
            </div>
          </figure>
          {rest.length > 0 && (
            <Stagger gap={0.12} className="grid gap-5 sm:grid-cols-2">
              {rest.map((c, i) => (
                <Item key={c._id || i} as="figure" whileHover={{ y: -4 }} className="m-0 rounded-2xl border-2 border-dashed border-line bg-surface p-6">
                  <Stars n={c.score} />
                  <blockquote className="m-0 mt-3 mb-5 leading-relaxed text-fg">{c.body}</blockquote>
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