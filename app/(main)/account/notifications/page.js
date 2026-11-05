import React from "react"
import { authUser } from "@/utils/auth"
import UserPanelLayout from "../UserPanelLayout"
import { userNotifications } from "@/components/modules/notifications/getNotifications"
import NotificationsPage from "@/components/modules/notifications/NotificationsPage"

export default async function page() {
    const user = await authUser()
    return (
        <UserPanelLayout title="Notifications">
            <NotificationsPage scope="user" items={await userNotifications(user?._id)} />
        </UserPanelLayout>
    )
}
