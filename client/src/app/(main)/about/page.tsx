import Image from 'next/image'
import Link from 'next/link'
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
          className="relative mx-auto w-full max-w-md lg:col-span-5">
          <Parallax distance={24}><Float amount={7}>
            <div className="no-tint aspect-[4/5] overflow-hidden rounded-t-[220px] rounded-b-2xl bg-soft shadow-[0_0_0_8px_var(--bg),0_0_0_9px_var(--line),0_24px_50px_-24px_rgba(20,41,90,0.35)]">
              <img src="/images/cafe-storefront.jpg" alt="The Blue Tea storefront with its blue awning" className="no-tint h-full w-full object-cover object-[42%_center]" />
            </div>
          </Float></Parallax>
          <MotionDiv initial={{ opacity: 0, scale: 0.6, rotate: -10 }} whileInView={{ opacity: 1, scale: 1, rotate: 6 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 }} className="absolute top-8 right-2 sm:-right-3"><span className="block rounded-full bg-[#bff0d5] px-5 py-2 text-sm font-semibold text-[#0b3b25] shadow-md">Brewed to order</span></MotionDiv>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7">
          <span className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--script)]">Welcome in</span>
          <h2 style={{ color: "var(--head)" }} className="mb-5 max-w-lg text-4xl leading-[1.12] tracking-tight max-md:text-3xl">Sit down here. Take it home from next door.</h2>
          <p className="mb-8 max-w-xl text-base leading-[1.8] text-muted">
            We brew every cup to order, from single-origin teas to small-batch coffee. The shop next door sells the same leaves, brewers and cups, so you can make it at home just as well.
          </p>
          <Stagger as="ul" gap={0.1} delay={0.2} className="m-0 mb-9 flex list-none flex-wrap gap-3 p-0">
            {features.map((f) => (
              <Item as="li" key={f.label} y={14} className="flex items-center gap-2.5 rounded-full border border-solid border-line bg-surface py-2 pr-5 pl-2.5 shadow-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-soft">
                  <Image className="no-tint size-5 object-contain" width={48} height={48} src={f.icon} alt="" />
                </span>
                <span className="text-sm font-medium text-fg">{f.label}</span>
              </Item>
            ))}
          </Stagger>
          <Link href="/about" className="btn-organic inline-flex bg-brown px-7 py-3 text-sm font-medium !text-white">Our story</Link>
        </MotionDiv>
      </div>
    </section>
  )
}