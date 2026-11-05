import React from 'react'
import UserPanelLayout from "../UserPanelLayout"
import AccountDetail from '@/components/template/account/account-detail/accountDetail'
export default function page() {
    return (
        <UserPanelLayout title="Account details">
            <div className="transparentCard">
                <AccountDetail />
            </div>
        </UserPanelLayout>
    )
}
