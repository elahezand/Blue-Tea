"use client"
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import useBasket from '@/utils/hooks/useBasket'
import toast from 'react-hot-toast'
import styles from "./cartItems.module.css"
import { usePost } from '@/utils/hooks/useReactQueryPublic'
import { CiCircleRemove } from "react-icons/ci"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Zod schema for shipping address
const shippingSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    phone: z.string().min(8, "Phone number is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(4, "Postal code is required"),
})

export default function CartItems({ userId }) {
    const { addToBasket, increaseCount, decreaseCount, cart, setCart, removeFromCart } = useBasket()

    const [total, setTotal] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState("online")

    const calculateTotal = useCallback(() => {
        const sum = cart.reduce((acc, item) => acc + item.price * item.count, 0)
        setTotal(sum)
    }, [cart])

    useEffect(() => {
        calculateTotal()
    }, [calculateTotal])

    const { mutate } = usePost("/orders", {
        onSuccess: () => {
            toast.success("Order created successfully!")
            setCart([])
        }
    })

    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
        }
    })

    const submitOrder = (data) => {
        if (!cart.length) return toast.error("Cart is empty")
        const orderData = {
            user: userId,
            items: cart,
            totalPrice: total,
            paymentMethod,
            shippingAddress: data
        }
        mutate(orderData)
    }

    return (
        <div className='container'>
            <div className="row align-items-start justify-content-between">
                {/* Cart Items */}
                <div className="col-lg-7 mb-4">
                    <div className={`${styles.basket} mb-3 rounded-3`}>
                        {cart.length ? cart.map((p, index) => (
                            <div key={p.id} className="d-flex align-items-center my-3">
                                <Image
                                    width={50}
                                    height={50}
                                    src={p.img}
                                    priority
                                    className="rounded me-3"
                                    alt={p.title}
                                />
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-white">{p.title}</h6>
                                    <small className='text-white'>${p.price}</small>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <button
                                        onClick={() => decreaseCount(p.id)}
                                        className={`${styles.btn_decrease}`}>
                                        −
                                    </button>
                                    <span className={styles.price}>{p.count}</span>
                                    <button
                                        onClick={() => increaseCount(p.id)}
                                        className={`${styles.btn_increase}`}>
                                        +
                                    </button>
                                    <button
                                        className={styles.btn}
                                        onClick={() =>
                                            addToBasket(p.id, p.name, p.img, p.price, p.count)}>
                                        Add To Card</button>
                                </div>
                                <CiCircleRemove
                                    onClick={() => removeFromCart(p.id)}
                                    className={styles.remove_item}
                                />
                            </div>
                        )) : <p className='text-white'>Cart is empty</p>}
                    </div>
                </div>

                {/* Shipping Form & Payment */}
                <div className="col-lg-5">
                    <form onSubmit={handleSubmit(submitOrder)} className="mb-4">
                        <h6 className="text-white mb-2">Shipping Address</h6>
                        {["fullName", "phone", "address", "city", "postalCode"].map((field) => (
                            <Controller
                                key={field}
                                name={field}
                                control={control}
                                render={({ field: controllerField }) => (
                                    <div className="mb-2">
                                        <input
                                            {...controllerField}
                                            placeholder={field}
                                            className="form-control"
                                        />
                                        {errors[field] && <span className="text-danger">{errors[field]?.message}</span>}
                                    </div>
                                )}
                            />
                        ))}

                        <h6 className="text-white mt-3">Payment Method</h6>
                        <select
                            className="form-select mb-3"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="online">Online</option>
                            <option value="cash">Cash</option>
                        </select>

                        <h6 className="text-white">Total: ${total}</h6>
                        <button type="submit" className={`${styles.btn} mt-3 w-100`}>Proceed to Checkout</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
