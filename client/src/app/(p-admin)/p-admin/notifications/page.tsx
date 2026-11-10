import React from "react"
import { getAdminNotifications } from "@/services/notification.service"
import NotificationsPage from "@/components/modules/notifications/NotificationsPage"

export const metadata = { title: "Notifications" }
export default async function page() {
    return <NotificationsPage scope="admin" items={await getAdminNotifications()} />
}
