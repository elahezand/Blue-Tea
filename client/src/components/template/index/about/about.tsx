import Link from 'next/link'
import Image from 'next/image'
import { Float, Parallax, Stagger, Item, MotionDiv } from '@/components/modules/motion'

const features = [
  { icon: "/about-icon-1.png", label: "Quality coffee" },
  { icon: "/about-icon-2.png", label: "Our branches" },
  { icon: "/about-icon-3.png", label: "Free delivery" },
]

export default function About() {
  return (
    <section className="overflow-hidden">
      <div className="container grid items-center gap-14 lg:grid-cols-12">
        <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="group relative mx-auto w-full max-w-md lg:col-span-5">
          <Parallax distance={24}><Float amount={7}>
            <div className="relative rotate-[-2deg]">
              {/* Dashed outline behind the photo, like the barista cards */}
              <span aria-hidden className="absolute inset-0 -translate-y-3 translate-x-3 rounded-xl border border-dashed border-[var(--green)]/60 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />

              <div className="no-tint relative aspect-[4/5] overflow-hidden rounded-xl bg-soft shadow-[0_24px_50px_-24px_rgba(20,41,90,0.35)] ring-[6px] ring-[var(--surface)]">
                <img src="/images/cafe-storefront.jpg" alt="The Blue Tea storefront with its blue awning" className="no-tint h-full w-full object-cover object-[42%_center] transition-transform duration-700 group-hover:scale-105" />
              </div>

              {/* Paper tape holding the photo on the page */}
              <span aria-hidden className="tape -top-3 -left-8 -rotate-[35deg]" />
              <span aria-hidden className="tape -right-7 -bottom-4 rotate-[30deg]" />
            </div>
          </Float></Parallax>
          <MotionDiv initial={{ opacity: 0, scale: 0.6, rotate: -10 }} whileInView={{ opacity: 1, scale: 1, rotate: 6 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 }} className="absolute top-8 right-2 sm:-right-3">
            <span className="block rounded-full bg-[var(--navy)] px-5 py-2 text-sm font-semibold text-[var(--cream)] shadow-md ring-1 ring-[var(--lamp)]/40">Brewed to order</span>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7">
          <span className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--script)]">Welcome in</span>
          <h2 style={{ color: "var(--head)" }} className="mb-5 max-w-lg text-4xl leading-[1.12] tracking-tight max-md:text-3xl">Sit down here. Take it home from next door.</h2>
          <p className="mb-8 max-w-xl text-base leading-[1.8] text-muted">
            We brew every cup to order, from single-origin teas to small-batch coffee. The shop next door sells the same leaves, brewers and cups, so you can make it at home just as well.
          </p>
          <Stagger as="ul" gap={0.1} delay={0.2} className="mb-18 grid max-w-xl list-none grid-cols-3 gap-3 p-0 sm:gap-5">
            {features.map((f) => (
              <Item as="li" key={f.label} y={14} className="flex flex-col items-center gap-2 border-t border-dashed border-line pt-5 sm:gap-3 sm:pt-8">
                <span className="flex size-14 items-center justify-center rounded-lg bg-[var(--navy)] sm:size-18">
                  <Image className="no-tint size-7 object-contain sm:size-8" width={58} height={58} src={f.icon} alt="" />
                </span>
                <span className="font-display text-sm leading-tight text-fg sm:text-lg">{f.label}</span>
              </Item>
            ))}
          </Stagger>
          <Link href="/about" className="btn btn-primary btn-lg">Our story</Link>
        </MotionDiv>
      </div>
    </section>
  )
}