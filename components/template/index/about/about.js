
import React from 'react'
import styles from "./about.module.css"
import Image from 'next/image'
import { MotionDiv } from '@/utils/animate'

export default function About() {
  return (
    <section>
      <div className="container">
        <div
          className="heading">
          about us <span>why choose us</span>
        </div>
        <div className={`container ${styles.about_container}`}>
          <div className="row justify-content-between">
            <MotionDiv
              initial={{ opacity: 0, x:-100 }}
              whileInView={{ opacity: 1, x:0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`d-flex flex-column gap-5 col-lg-5 ${styles.image_wrapper}`}
            >
              <div>
                <Image
                  src="/images/unnamed (1).jpg"
                  alt="coffee"
                  width={200}
                  height={200}
                />
              </div>

              <div>
                <Image
                  src="/image-wm (1).png"
                  alt=""
                  width={200}
                  height={200}
                />
              </div>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.07 }}
              className="col-lg-6">
              <div className={styles.content}>
                <h3 className={styles.title}>whats make our coffee special!</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum natus nam numquam quo illum similique a mollitia distinctio! Fuga, doloremque nesciunt cumque tenetur corporis, eius debitis dolorem natus neque beatae laboriosam accusamus incidunt commodi non aliquam facilis perspiciatis cum omnis dicta dolore. Iure, cupiditate sed omnis, in nulla illum, maiores labore laboriosam placeat culpa animi libero aliquam ipsum rem voluptatem corporis accusantium incidunt esse reprehenderit aliquid. Omnis recusandae numquam corporis minima aperiam Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem odit est ullam at aspernatur accusamus vel . ..</p>
                <a href="#"
                  className={styles.btn}>read more</a>
                <div className={styles.icons_container}>
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={styles.icons}>
                    <Image width={200} height={200}
                      src="/about-icon-1.png" alt="" />
                    <h3>quality coffee</h3>
                  </MotionDiv>
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={styles.icons}>
                    <Image width={200} height={200}
                      src="/about-icon-2.png" alt="" />
                    <h3>our branches</h3>
                  </MotionDiv>
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={styles.icons}>
                    <Image width={200} height={200}
                      src="/about-icon-3.png" alt="" />
                    <h3>free delivery</h3>
                  </MotionDiv>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  )
}



