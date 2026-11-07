import React from 'react'
import UserPanelLayout from "../UserPanelLayout"
import OrderClinet from '@/components/template/account/orders/orderClinet'
export default function page() {
    return (
        <UserPanelLayout title="My orders">
            <OrderClinet />
        </UserPanelLayout>
    )
}
