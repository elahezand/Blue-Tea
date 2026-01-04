import React from 'react'
import Image from 'next/image'
import { MotionDiv } from '@/utils/animate'
import styles from "@/components/template/index/barista/barista.module.css"

const baristas = [
    { name: "Steve", role: "Boss", text: "Your favourite coffee daily lives.", img: "/images/team/portrait-elegant-old-man-wearing-suit.jpg" },
    { name: "Sandra", role: "Manager", text: "Your favourite coffee daily lives.", img: "/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg" },
    { name: "Jackson", role: "Senior", text: "Your favourite coffee daily lives.", img: "/images/team/small-business-owner-drinking-coffee.jpg" },
    { name: "Michelle", role: "Barista", text: "Your favourite coffee daily consectetur.", img: "/images/team/smiley-business-woman-working-cashier.jpg" },
]

export default function Barista() {
    return (
        <section>
            <h2 className="heading">Creative Baristas <span>Meet People</span></h2>
            <div className='container'>
                <div className='row justify-content-between align-items-center'>
                    <div className='col-lg-5'>
                        <video
                            className={styles.video}
                            autoPlay
                            muted
                            loop
                            src="/17644241496301debd62ac8b630a64317bd03ccdd4fc9_t1.mp4">
                        </video>
                    </div>
                    <div className={`${styles.baristas_grid} col-lg-6`}>
                        {baristas.map((b, i) => (
                            <MotionDiv
                                key={i}
                                initial={{ opacity: 0, scale: 0.6 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={styles.team_block__wrap}
                            >
                                <div className={styles.team_block_image__wrap}>
                                    <Image
                                        src={b.img}
                                        alt={b.name}
                                        width={400}
                                        height={400}
                                        className={styles.team_block__image}
                                    />
                                </div>
                                <div className={styles.team_block__info}>
                                    <div className="d-flex align-items-center mb-2">
                                        <h4 className="mb-0">{b.name}</h4>
                                        <span className={styles.badge}>{b.role}</span>
                                    </div>
                                    <p>{b.text}</p>
                                </div>
                            </MotionDiv>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
