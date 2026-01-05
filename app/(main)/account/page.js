import React from 'react'
import UserPanelLayout from './UserPanelLayout'
import IndexClient from '@/components/template/account/index/indexClient'

export default function page() {
    return (
        <UserPanelLayout>
           <IndexClient/>
        </UserPanelLayout>
    )
}
