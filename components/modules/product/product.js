"use client"
import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import styles from "./product.module.css"
import { CiSearch } from "react-icons/ci";
import useBasket from '@/utils/hooks/useBasket';
import { usePost } from '@/utils/hooks/useReactQueryPublic';
import toast from 'react-hot-toast';
export default function Product({ name, img, shortDescription, score, price, id }) {
    const { addToBasket } = useBasket()
    const { mutate } = usePost("/wishList", {
        onSuccess: (data) => {
            toast.success("Product added To wishList Successfully :");
        }
    })

    const addToFavoriteList = async () => {
        const newItem = {
            productID: id
        }
        mutate(newItem)
    }
    return (
        <div className={styles.product_item}>
            <div className={styles.img_container}>
                <Image
                    width={200}
                    height={200}
                    src={img} alt="" />
                <div className={styles.details_container}>
                    <div className={styles.icons}>
                        <Link href={`/products/${id}`}>
                            <CiSearch />
                            <p className={styles.tooltip}>LoOK</p>
                        </Link>
                        <span
                            onClick={() =>
                                addToFavoriteList()}
                            className={styles.favorite}
                        >  Add To Favriote
                        </span>
                    </div>
                    <button
                        onClick={() =>
                            addToBasket(id, name, img, price, 1)}>
                        Add To Card</button>
                </div>
            </div>
            <div className={`shadow-sm text-center p-3 position-relative mt-n5 mx-4 ${styles.info_container}`}>
                <h4 className={styles.title_info}> {name}</h4>
                <span>{shortDescription}</span>
                <span>{score}</span>
                <span> $ {price}</span>
            </div>

        </div>

    );

}



