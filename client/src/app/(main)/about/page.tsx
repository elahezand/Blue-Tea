import Link from 'next/link'
import { Parallax, Stagger, Item, MotionDiv } from '@/components/modules/motion'

const values = [
  { title: "Slow brewing", text: "Every pot is timed and every cup is poured when you order it, never from a waiting jug." },
  { title: "Honest leaves", text: "We buy loose leaf and whole beans in small lots, so what you drink is always fresh." },
  { title: "A seat for everyone", text: "Stay for five minutes or the whole afternoon. Nobody will rush you out." },
]

function Storefront() {
  return (
    <svg viewBox="0 0 480 320" className="w-full rounded-2xl drop-shadow-[0_24px_30px_rgba(20,41,90,0.18)]" role="img" aria-label="A drawing of the Blue Tea storefront with its navy awning, glass doors, potted trees and a chalkboard sign">
      <rect x="0" y="0" width="480" height="284" fill="#ece3d2" />
      <path d="M0 40h480M0 100h120M330 100h150M0 160h110M340 160h60M0 220h100" stroke="#d9cdb6" strokeWidth="1.5" />

      <rect x="0" y="282" width="480" height="38" fill="#cfc6b6" />
      <path d="M0 296h480M0 309h480M30 282v14M90 282v14M150 282v14M210 282v14M270 282v14M330 282v14M390 282v14M450 282v14M60 296v13M120 296v13M180 296v13M240 296v13M300 296v13M360 296v13M420 296v13" stroke="#b9af9c" strokeWidth="1.2" />

      <rect x="402" y="34" width="78" height="250" fill="#1f3d30" />
      <rect x="412" y="48" width="58" height="40" rx="3" fill="none" stroke="#2f5a46" strokeWidth="3" />
      <rect x="412" y="100" width="58" height="170" rx="3" fill="none" stroke="#2f5a46" strokeWidth="3" />
      <circle cx="414" cy="190" r="3" fill="#c9a24a" />

      <rect x="112" y="26" width="218" height="56" rx="3" fill="var(--navy)" />
      <rect x="118" y="32" width="206" height="44" rx="2" fill="none" stroke="var(--cream)" strokeOpacity=".7" strokeWidth="1.5" />
      <circle cx="146" cy="54" r="16" fill="var(--cream)" />
      <g fill="none" stroke="var(--navy)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M139 51h12v3a6 6 0 0 1-12 0v-3Z" />
        <path d="M151 52.5h2a2.5 2.5 0 0 1 0 5h-2.5M137 64h16" />
      </g>
      <path d="M143 47c-1 1 1 2 0 3M147 47c-1 1 1 2 0 3" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" />
      <text x="172" y="63" fontSize="25" fontWeight="700" letterSpacing="3" fill="var(--cream)">BLUE <tspan fill="#4cc38a">TEA</tspan></text>

      <line x1="330" y1="60" x2="342" y2="60" stroke="#3a3a3a" strokeWidth="3" />
      <circle cx="362" cy="60" r="21" fill="var(--navy)" stroke="var(--cream)" strokeWidth="2.5" />
      <g fill="none" stroke="var(--cream)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M354 58h13v3a6.5 6.5 0 0 1-13 0v-3Z" />
        <path d="M367 59.5h2a2.5 2.5 0 0 1 0 5h-2.5M352 72h17" />
      </g>
      <path d="M358 50c-1 1 1 2 0 3M362 50c-1 1 1 2 0 3" fill="none" stroke="#4cc38a" strokeWidth="1.6" strokeLinecap="round" />

      <path d="M116 90h220l14 24H102Z" fill="#0f2047" />
      <rect x="102" y="114" width="248" height="16" fill="var(--navy)" />
      <text x="226" y="126.5" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="2" fill="var(--cream)">BLUE <tspan fill="#4cc38a">TEA</tspan></text>

      <rect x="122" y="132" width="206" height="150" fill="var(--navy)" />
      <rect x="130" y="138" width="190" height="144" fill="#f3dcae" />
      <rect x="130" y="138" width="190" height="144" fill="var(--lamp)" fillOpacity=".25" />
      <path d="M140 200h40M140 222h40M270 200h40M270 222h40" stroke="#b58a52" strokeWidth="2.5" />
      <g stroke="#7a5a33" strokeWidth="1.2">
        <line x1="155" y1="138" x2="155" y2="158" />
        <line x1="200" y1="138" x2="200" y2="166" />
        <line x1="250" y1="138" x2="250" y2="160" />
        <line x1="295" y1="138" x2="295" y2="164" />
      </g>
      <g fill="#fff6dc" stroke="#e7b964" strokeWidth="1.5">
        <circle cx="155" cy="162" r="5" />
        <circle cx="200" cy="170" r="5" />
        <circle cx="250" cy="164" r="5" />
        <circle cx="295" cy="168" r="5" />
      </g>
      <circle cx="295" cy="214" r="9" fill="var(--navy)" />
      <path d="M291 213h7v2a3.5 3.5 0 0 1-7 0Z" fill="var(--cream)" />
      <path d="M176 138v144M226 138v144M276 138v144" stroke="var(--navy)" strokeWidth="5" />
      <path d="M218 214v30M234 214v30" stroke="#c9a24a" strokeWidth="2.5" strokeLinecap="round" />

      <line x1="86" y1="196" x2="86" y2="244" stroke="#5e4a32" strokeWidth="3" />
      <circle cx="86" cy="172" r="30" fill="#355e34" />
      <circle cx="74" cy="164" r="12" fill="#457a42" />
      <circle cx="98" cy="180" r="10" fill="#2c4f2b" />
      <path d="M66 246h40l-5 38H71Z" fill="var(--navy)" />
      <g fill="#f7f4ec" stroke="#d6d0c0" strokeWidth=".8">
        <circle cx="70" cy="244" r="6" /><circle cx="80" cy="241" r="6.5" /><circle cx="92" cy="241" r="6.5" /><circle cx="102" cy="244" r="6" />
      </g>

      <line x1="364" y1="196" x2="364" y2="244" stroke="#5e4a32" strokeWidth="3" />
      <circle cx="364" cy="170" r="30" fill="#355e34" />
      <circle cx="352" cy="162" r="12" fill="#457a42" />
      <circle cx="376" cy="178" r="10" fill="#2c4f2b" />
      <path d="M344 246h40l-5 38h-30Z" fill="var(--navy)" />
      <g fill="#f7f4ec" stroke="#d6d0c0" strokeWidth=".8">
        <circle cx="348" cy="244" r="6" /><circle cx="358" cy="241" r="6.5" /><circle cx="370" cy="241" r="6.5" /><circle cx="380" cy="244" r="6" />
      </g>

      <g>
        <ellipse cx="32" cy="246" rx="20" ry="4" fill="#bdb6a8" stroke="#8f887a" />
        <line x1="32" y1="250" x2="32" y2="282" stroke="#2a2a2a" strokeWidth="2.5" />
        <path d="M22 284h20" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
        <g stroke="#c9a24a" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M4 232v50M18 262l-2 20M4 262h14" />
          <path d="M60 232v50M46 262l2 20M46 262h14" />
        </g>
        <rect x="1" y="230" width="8" height="24" rx="3" fill="#f4f1e8" stroke="var(--navy)" strokeWidth="1.2" />
        <rect x="55" y="230" width="8" height="24" rx="3" fill="#f4f1e8" stroke="var(--navy)" strokeWidth="1.2" />
        <rect x="3" y="258" width="17" height="5" rx="2" fill="#f4f1e8" stroke="var(--navy)" strokeWidth="1.2" />
        <rect x="44" y="258" width="17" height="5" rx="2" fill="#f4f1e8" stroke="var(--navy)" strokeWidth="1.2" />
        <path d="M1 236l8 4M1 242l8 4M1 248l8 4M55 236l8 4M55 242l8 4M55 248l8 4M6 258l3 5M11 258l3 5M16 258l3 5M47 258l3 5M52 258l3 5M57 258l3 5" stroke="var(--navy)" strokeWidth="1.3" />
      </g>

      <g strokeLinecap="round">
        <line x1="416" y1="292" x2="426" y2="226" stroke="#b08a4a" strokeWidth="3" />
        <line x1="470" y1="292" x2="460" y2="226" stroke="#b08a4a" strokeWidth="3" />
        <rect x="418" y="226" width="50" height="58" rx="2" fill="#1d2433" stroke="#b08a4a" strokeWidth="2.5" />
        <circle cx="443" cy="240" r="7" fill="var(--navy)" stroke="var(--cream)" strokeWidth="1" />
        <path d="M440 239h6v1.5a3 3 0 0 1-6 0Z" fill="var(--cream)" />
        <text x="443" y="256" textAnchor="middle" fontSize="6" fontWeight="700" letterSpacing="1" fill="var(--cream)">BLUE <tspan fill="#4cc38a">TEA</tspan></text>
        <text x="443" y="267" textAnchor="middle" fontSize="7.5" className="script" fill="#f4f1e8">Good Tea</text>
        <text x="443" y="277" textAnchor="middle" fontSize="7.5" className="script" fill="#f4f1e8">Good Mood</text>
      </g>
    </svg>
  )
}

export default function About() {
  return (
    <section className="overflow-hidden">
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="lg:col-span-6">
          <span className="script mb-1 inline-block -rotate-2 text-3xl text-[var(--script)]">How it started</span>
          <h2 style={{ color: "var(--head)" }} className="mb-6 text-4xl leading-[1.12] tracking-tight max-md:text-3xl">
            It began with one kettle and a few chairs.
          </h2>
          <div className="mb-8 space-y-4 border-l-2 border-solid border-[var(--lamp)] pl-5 text-base leading-[1.8] text-muted">
            <p className="m-0">Blue Tea started as a tiny counter under a blue awning, with one kettle, a handful of teas and a few chairs by the window.</p>
            <p className="m-0">Neighbours kept asking where they could buy the leaves we were brewing. So we opened a small shop right next door, and the two have grown up together ever since.</p>
          </div>
          <Link href="/#reservation" className="btn-organic inline-flex bg-brown px-7 py-3 text-sm font-medium !text-white">Come and visit</Link>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="relative lg:col-span-6">
          <Parallax distance={20}>
            <Storefront />
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
  )
}