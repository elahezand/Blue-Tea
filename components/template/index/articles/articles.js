"use client"
import React, { useRef } from 'react'
import Image from 'next/image'
import { MotionDiv } from '@/utils/animate'
import styles from './articles.module.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Scrollbar } from 'swiper/modules'
import Link from 'next/link'

export default function ArticlesSection({ articles }) {
    const swiperRef = useRef(null);

    return (
        <section className={styles.articles_section}>
            <div className="container">
                <h2 className="heading">Our Articles <span>Learn & Explore</span></h2>
                <div className="d-flex justify-content-end mb-5">
                    <Link href={"/articles"} className="classic">More...</Link>
                </div>
                {/* Navigation Buttons */}
                <div className="navigation_buttons">
                    <button onClick={() => swiperRef.current?.slidePrev()} className="prevBtn">‹</button>
                    <button onClick={() => swiperRef.current?.slideNext()} className="nextBtn">›</button>
                </div>

                <Swiper
                    onSwiper={(swiper) => { swiperRef.current = swiper }}
                    modules={[Navigation, Scrollbar]}
                    spaceBetween={20}
                    loop
                    slidesPerView={1}
                    scrollbar={{ draggable: true }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="mySwiper">
                    {articles.map((a, i) => (
                        <SwiperSlide key={i}>
                            <MotionDiv
                                initial={{ opacity: 0, scale: 0.3 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={styles.article_card}
                            >
                                <div className={styles.article_image_wrap}>
                                    <Image
                                        src={a.cover}
                                        alt={a.title}
                                        width={400}
                                        height={400}
                                        className={styles.article_image}
                                    />
                                    <Link
                                        href={`/articles/${a._id}`}
                                        className={styles.article_overlay}>
                                        <h4>{a.title}</h4>
                                        <p>{a.shortDescription}</p>
                                        <span className={styles.author}>{a.author}</span>
                                    </Link>
                                </div>
                            </MotionDiv>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}
