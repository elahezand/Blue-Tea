import Link from 'next/link'
import Image from 'next/image'
import { LuCoffee, LuStore, LuTruck } from 'react-icons/lu'
import { Float, Parallax, Stagger, Item, MotionDiv, SectionHeader } from '@/components/modules/motion'
import Barista from "../barista/barista"

const features = [
  { Icon: LuCoffee, label: "Quality coffee" },
  { Icon: LuStore, label: "Our branches" },
  { Icon: LuTruck, label: "Free delivery" },
]
const photoSizes = "(min-width: 1344px) 704px, (min-width: 1024px) 58vw, (min-width: 704px) 704px, 100vw"

export default function About() {
  return (
    <section className="overflow-hidden">
      <div className="container !max-w-[84rem]">
        <SectionHeader
          script="Welcome in"
          title="Sit down here. Take it home from next door."
          className="mb-8 sm:mb-12"
        />
      </div>
      <div className="container grid !max-w-[84rem] items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-[44rem] lg:col-span-7">
          <Parallax distance={24}><Float amount={7}>
            <div className="polaroid polaroid-static relative w-full">
              <span aria-hidden className="tape tape-sm -top-2 left-1 z-10 -rotate-[28deg]" />
              <span aria-hidden className="tape tape-sm -bottom-2 right-2 z-10 -rotate-[28deg]" />
              <div className="relative aspect-video overflow-hidden bg-soft">
                <Image src="/images/blue-tea-cafe-entrance.webp" alt="Blue Tea Café entrance with navy doors and warm lights visible through the windows" fill sizes={photoSizes} className="no-tint object-cover" />
                <Image src="/images/blue-tea-cafe-entrance-snow.webp" alt="" fill sizes={photoSizes} className="christmas-photo no-tint object-cover" />
              </div>
            </div>
          </Float></Parallax>
          <MotionDiv initial={{ opacity: 0, scale: 0.6, rotate: -10 }} whileInView={{ opacity: 1, scale: 1, rotate: 6 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 }} className="absolute top-8 right-2 sm:-right-3">
            <span className="block rounded-full bg-[var(--navy)] px-5 py-2 text-sm font-semibold text-[var(--cream)] shadow-md ring-1 ring-[var(--lamp)]/40">Brewed to order</span>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5">
          <p className="mb-8 max-w-xl text-base leading-relaxed text-muted">
            We brew every cup to order, from single-origin teas to small-batch coffee. The shop next door sells the same leaves, brewers and cups, so you can make it at home just as well.
          </p>
          <Stagger as="ul" gap={0.1} delay={0.2} className="mb-7 grid max-w-xl list-none grid-cols-3 gap-2 border-y border-solid border-line px-0 py-4 sm:gap-4 sm:py-5">
            {features.map(({ Icon, label }) => (
              <Item as="li" key={label} y={14} className="flex min-w-0 flex-col items-center gap-2 text-center sm:gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-[var(--navy)] text-[var(--lamp)] sm:size-12">
                  <Icon aria-hidden="true" className="size-5 sm:size-6" strokeWidth={1.65} />
                </span>
                <span className="font-display text-sm leading-tight text-fg sm:text-base">{label}</span>
              </Item>
            ))}
          </Stagger>
          <Link href="/about" className="btn btn-primary btn-lg">Our story</Link>
        </MotionDiv>
      </div>
      <Barista />
    </section>
  )
}
