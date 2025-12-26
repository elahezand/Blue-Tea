"use client"
import React, { useState, useEffect } from 'react'
import { useCallback } from 'react'
import Image from 'next/image'
import useBasket from '@/utils/hooks/useBasket'
import toast from 'react-hot-toast'
import styles from "./cartItems.module.css"
import { usePost } from '@/utils/hooks/useReactQueryPanel'
import Modal from '@/components/modules/modal/editModal'
import { CiCircleRemove } from "react-icons/ci";

export default function CartItems({ userId }) {
    const { addToBasket, increaseCount, decreaseCount, cart, setCart, removeFromCart } = useBasket()

    const [showModal, setShowModal] = useState(false);

    const [total, setTotal] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });

    const calculateProducts = useCallback(() => {
        if (cart.length) {
            setTotal(cart.reduce((prev, current) => prev + current.price * current.count, 0))
        }
    }, [cart])


    useEffect(() => {
        calculateProducts()
    }, [calculateProducts]);

    const { mutate } = usePost("/orders", {
        onSuccess: (data) => {
            setShowModal(true)
            setCart([]);
        },
        onError: (err) => {
            toast.error("Error creating order");
        },
    });

    const submitOrder = async () => {
        if (!cart.length) return toast.error("Cart is empty");
        const orderData = {
            user: userId,
            items: cart,
            totalPrice: total,
            paymentMethod,
            shippingAddress,
        };
        mutate(orderData)
    }


    return (
        <div className='container'>
            <div className="row align-items-center">
                {/* Cart Items */}
                <div className="col-lg-8">
                    <div className={`${styles.basket} mb-3 rounded-3`}>
                        {cart.length ? cart.map((p, index) => (
                            <>
                                <div
                                    key={index + 1}
                                    className="d-flex align-items-center my-3">
                                    <Image
                                        width={50}
                                        height={50}
                                        src={p.img}
                                        className="rounded me-3"
                                        alt="product"
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 text-white">{p.title}</h6>
                                        <small className='text-white'> $ {p.price}</small>
                                    </div>
                                    <div className="d-flex align-items-center gap-1">
                                        <button
                                            onClick={() => decreaseCount(p.id)}
                                            className={`${styles.btn_decrease} m-1`}>
                                            −
                                        </button>
                                        <span className={styles.price}> {p.count}</span>
                                        <button
                                            onClick={() => increaseCount(p.id)}
                                            className={`${styles.btn_increase} m-1`}>
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
                                        className={styles.remove_item} />
                                </div>
                            </>

                        )) : null}
                    </div>
                    {/* Shipping Address */}
                    <div className={styles.address}>
                        <h6 className="mb-3">Shipping Address</h6>
                        {Object.keys(shippingAddress).map((key) => (
                            <input
                                key={key}
                                className="form-control mb-2"
                                placeholder={key}
                                value={shippingAddress[key]}
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        [key]: e.target.value,
                                    })
                                }
                            />
                        ))}
                    </div>
                </div>
                {/* Order Summary */}
                <div className="col-lg-4">
                    <div className={styles.order_summary}>
                        <div>
                            <h6>Payment Method</h6>
                            <select
                                className="form-select mb-3"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="online">Online</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>
                        <div>
                            <h6 className="mb-3">Order Summary</h6>
                            {/* Discount Code */}
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Discount code"
                                />
                                <button
                                    className={styles.apply_btn}>
                                    Apply
                                </button>
                            </div>
                            <ul className="list-group list-group-flush mb-3 rounded-3">
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Discount</span>
                                    <span className="text-success">

                                    </span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total</span>
                                    <strong>{total}</strong>
                                </li>
                            </ul>

                            <button
                                onClick={() => submitOrder()}
                                className={styles.btn}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal &&
                <Modal
                    icon="success"
                    title="Your Order created Successfully"
                    href="/" />
            }
        </div>
    )
}
