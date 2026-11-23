import type { Comment } from "@/types/comment"
import { SectionHeader } from "@/components/modules/motion"

function Stars({ score }: { score: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(score)))
  return (
    <span className="inline-flex text-sm tracking-widest" role="img" aria-label={`${score} out of 5 stars`}>
      <span aria-hidden>{"★".repeat(filled)}<span className="opacity-30">{"★".repeat(5 - filled)}</span></span>
    </span>
  )
}

export default function Reviews({ comments = [] }: { comments?: Comment[] }) {
  const rated = comments.filter((comment) => Number.isFinite(comment.score))
  const featured = rated.filter((comment) => comment.score >= 4).slice(0, 3)
  if (!featured.length) return null
  const average = rated.reduce((total, comment) => total + comment.score, 0) / rated.length

  return (
    <section id="reviews" className="band">
      <div className="container">
        <SectionHeader animated={false} script="Kind words" title="What customers say" text="A few words from people who stopped by." className="mb-4" />
        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center sm:mb-12">
          <strong className="font-display text-2xl text-fg">{average.toFixed(1)}</strong>
          <span className="text-[var(--script)]"><Stars score={average} /></span>
          <span className="text-sm text-muted">{rated.length} recent {rated.length === 1 ? "review" : "reviews"}</span>
        </div>

        <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-8 p-0">
          {featured.map((comment) => (
            <li key={comment._id} className="flex w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]">
              <figure className="polaroid polaroid-static m-0 flex w-full flex-col text-center">
                <span aria-hidden className="tape tape-sm -top-3.5 left-1/2 -translate-x-1/2 -rotate-3" />
                <div className="flex min-h-32 flex-1 flex-col items-center justify-center gap-3 bg-[#f1e7d6] px-4 py-5 text-[#14295a]">
                  <blockquote className="m-0 break-words font-display text-lg leading-snug">{comment.body}</blockquote>
                  <span className="text-[#875314]"><Stars score={comment.score} /></span>
                </div>
                <figcaption className="min-h-14 pt-3">
                  <span className="script block break-words text-[1.65rem] leading-none text-[#14295a]">{comment.username}</span>
                  {comment.createdAt && (
                    <time dateTime={comment.createdAt} className="mt-1.5 block text-xs text-[#14295a]/70">
                      {new Date(comment.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </time>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
