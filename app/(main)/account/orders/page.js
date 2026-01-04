import React from 'react'
import UserPanelLayout from "../UserPanelLayout"
import OrderClinet from '@/components/template/account/orders/orderClinet'
export default function page() {
    return (
        <UserPanelLayout>
            <h4 className='fw-bold'
                style={{ color: "var(--brown-light)", marginBottom: "1rem" }}>
                orders
            </h4>
            <OrderClinet />
        </UserPanelLayout>
    )
}
