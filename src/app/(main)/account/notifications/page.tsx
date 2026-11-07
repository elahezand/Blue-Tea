import React from "react"
import { getMe } from "@/services/auth.server"
import { getUserNotifications } from "@/services/notification.service"
import UserPanelLayout from "../UserPanelLayout"
import NotificationsPage from "@/components/modules/notifications/NotificationsPage"

export default async function page() {
    const user = await getMe()
    return (
        <UserPanelLayout title="Notifications">
            <NotificationsPage scope="user" items={await getUserNotifications(user?._id)} />
        </UserPanelLayout>
    )
}
