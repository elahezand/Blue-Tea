"use client"
import React from 'react'
import styles from "@/components/template/index/reviews/reviews.module.css"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { MotionDiv } from '@/utils/animate';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Image from 'next/image';
import { avatar } from '@heroui/react';
export default function Reviews({ comments }) {
  return (

    <section
      className="container"
      id="section_4">
      <h1 className="heading">Review<span>By Customer</span></h1>
      <MotionDiv
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.07 }}
        className={styles.timeline}>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          loop={true}
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 2000, disableOnInteraction: false, reverseDirection: true }}
        >
          {comments
            ? comments.map((c, index) => (
              <SwiperSlide key={index} className={styles.box}>
                <i className="fas fa-quote-left"></i>
                <i className="fas fa-quote-right"></i>
                <Image
                  width={100}
                  height={100}
                  src={c?.avatar?avatar:"/64px-Unknown_person.jpg"}
                  alt=""
                />
                <div className={styles.stars}>
                  {Array.from({ length: 5 }, (_, i) =>
                    i < c.score ? (
                      <FaStar key={i} color="var(--brown-light)" />
                    ) : (
                      <FaRegStar key={i} color="var(--brown-light)" />
                    )
                  )}
                </div>
                <p>{c.body}</p>
                <h3>{c.username}</h3>
                <span>{c.score > 4 ? "satisfied client" : "unsatisfied client"}</span>
              </SwiperSlide>
            ))
            : null}
        </Swiper>
      </MotionDiv>
    </section>

  )
}


