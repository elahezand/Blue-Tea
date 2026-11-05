"use client"
import React from 'react'
import CartContext from '@/utils/context/cartProvider';
import { useContext } from 'react';
import { MdOutlineShoppingCart } from "react-icons/md"
import Link from 'next/link';
export default function ShoppingCartIcon() {
    const { cart } = useContext(CartContext)
    return (

        <Link href="/cart" className="relative text-fg">
            <MdOutlineShoppingCart color='currentColor' size={24} />
            <span
                className="absolute top-0 start-full inline-block -translate-x-1/2 -translate-y-1/2 rounded-full bg-brown px-[.65em] py-[.35em] text-center text-xs leading-none font-bold whitespace-nowrap text-white">
                {cart.length}
            </span>
        </Link>

    )
}
