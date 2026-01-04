"use client"
import Product from "@/components/modules/product/product";
import React from 'react';
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/grid";
import { Navigation, Scrollbar, Grid } from 'swiper/modules'
import Link from "next/link";


const Products = ({ products }) => {
    const swiperRef = useRef(null);
    return (
        <section>
            <div className="container">
                <h1 className="heading">Popular Products<span>positive effect on the body</span></h1>
                <div className="d-flex justify-content-end mb-5">
                    <Link href={"/products"} className="classic">More...</Link>
                </div>

                <div className="navigation_buttons">
                    <button onClick={() => swiperRef.current?.slidePrev()} className="prevBtn">‹</button>
                    <button onClick={() => swiperRef.current?.slideNext()} className="nextBtn">›</button>
                </div>

                <div className="swiper-wrapper-custom">
                    <Swiper
                        onSwiper={(swiper) => { swiperRef.current = swiper }}
                        modules={[Navigation, Scrollbar, Grid]}
                        spaceBetween={30}
                        loop={true}
                        grid={{
                            rows: 2,
                            fill: "row"
                        }}
                        scrollbar={{ draggable: true }}
                        breakpoints={{
                            640: { slidesPerView: 1, grid: { rows: 2 } },
                            768: { slidesPerView: 2, grid: { rows: 2 } },
                            1024: { slidesPerView: 4, grid: { rows: 2 } },
                        }}
                        className="mySwiper pb-4"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={item._id || index}>
                                <Product
                                    id={item._id}
                                    name={item.name}
                                    img={item.img}
                                    shortDescription={item.shortDescription}
                                    score={item.score}
                                    price={item.price}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default Products;


