import React from 'react'
import UserPanelLayout from "../UserPanelLayout"
import CommentsClient from '@/components/template/account/comments/commentsClient'
export default function page() {
    return (
        <UserPanelLayout>
            <h4 className='fw-bold'
                style={{
                    color: "var(--brown-light)",
                    marginBottom: "1rem"
                }}>
                Comments
            </h4>
            <CommentsClient />
        </UserPanelLayout>
    )
}
