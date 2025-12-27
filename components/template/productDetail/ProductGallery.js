"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function ProductGallery({ images }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const imageList = Array.isArray(images) ? images : [images];

    return (
        <div className="col-md-6">
            <Swiper
                style={{ "--swiper-navigation-color": "#000", "--swiper-pagination-color": "#000" }}
                spaceBetween={10}
                navigation={true}
                height={700}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="main-swiper my-5" >
                {imageList.length > 0 ? imageList.map((img, index) => (
                    <SwiperSlide
                        key={index}>
                        <Image
                            width={200}
                            height={200}
                            src={img}
                            priority
                            alt={`Product ${index}`} />
                    </SwiperSlide>
                )) :
                    <SwiperSlide>
                        <Image
                            height={200}
                            width={200}
                            src={imageList[0]}
                            alt={`Product ${index}`} />
                    </SwiperSlide>
                }
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={3}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumb-swiper">
                {imageList.length > 0 ? imageList.map((img, index) => (
                    <SwiperSlide key={index}>
                        <Image
                            width={200}
                            priority
                            height={200}
                            src={img} alt={`Product ${index}`}
                        />
                    </SwiperSlide>
                )) :
                    <SwiperSlide key={index}>
                        <Image
                            height={200}
                            width={200}
                            priority
                            src={imageList[0]}
                            alt={`Product ${index}`} />
                    </SwiperSlide>
                }
            </Swiper>
        </div>
    )
}
