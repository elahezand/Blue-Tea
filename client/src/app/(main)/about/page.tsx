import Link from 'next/link'
import Image from 'next/image'
import { Parallax, Stagger, Item, MotionDiv, PageHeader } from '@/components/modules/motion'

const values = [
  { title: "Slow brewing", text: "Every pot is timed and every cup is poured when you order it, never from a waiting jug." },
  { title: "Honest leaves", text: "We buy loose leaf and whole beans in small lots, so what you drink is always fresh." },
  { title: "A seat for everyone", text: "Stay for five minutes or the whole afternoon. Nobody will rush you out." },
]

export default function About() {
  return (
    <>
      <PageHeader crumbs={["About"]} script="How it started" title="It began with one kettle and a few chairs." />
      <section className="overflow-hidden !pt-10">
        <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-6">
            <div className="mb-8 space-y-4 border-l-2 border-solid border-[var(--lamp)] pl-5 text-base leading-[1.8] text-muted">
              <p className="m-0">Blue Tea started as a tiny counter under a blue awning, with one kettle, a handful of teas and a few chairs by the window.</p>
              <p className="m-0">Neighbours kept asking where they could buy the leaves we were brewing. So we opened a small shop right next door, and the two have grown up together ever since.</p>
            </div>
            <Link href="/#reservation" className="btn btn-primary">Come and visit</Link>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="relative lg:col-span-6">
            <Parallax distance={20}>
              <div className="polaroid polaroid-static relative w-full">
                <span aria-hidden className="tape tape-sm -top-2 left-1 z-10 -rotate-[28deg]" />
                <span aria-hidden className="tape tape-sm -bottom-2 right-2 z-10 -rotate-[28deg]" />
                <div className="relative aspect-video overflow-hidden bg-soft">
                  <Image
                    src="/images/blue-tea-behind-the-counter.webp"
                    alt="Behind the Blue Tea café counter, with an espresso machine, teapots, and shelves of loose-leaf tea"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="no-tint object-cover"
                  />
                </div>
              </div>
            </Parallax>
          </MotionDiv>
        </div>

        <div className="container mt-16">
          <p className="script mb-6 text-center text-3xl text-[var(--script)]">What we care about</p>
          <Stagger as="ul" gap={0.1} className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
            {values.map((v, i) => (
              <Item as="li" key={v.title} y={14} className="rounded-3xl bg-[var(--navy)] p-6 text-[var(--cream)] sm:p-8">
                <span className="font-display text-3xl text-[var(--lamp)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 mb-2 text-xl text-[var(--cream)]">{v.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-[var(--cream)]/75">{v.text}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  )
}
