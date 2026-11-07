import React from 'react'
import UserPanelLayout from "../UserPanelLayout"
import CommentsClient from '@/components/template/account/comments/commentsClient'
export default function page() {
    return (
        <UserPanelLayout title="My comments">
            <CommentsClient />
        </UserPanelLayout>
    )
}
