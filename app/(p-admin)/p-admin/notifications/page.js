import React from "react"
import { adminNotifications } from "@/components/modules/notifications/getNotifications"
import NotificationsPage from "@/components/modules/notifications/NotificationsPage"

export const metadata = { title: "Notifications" }
export default async function page() {
    return <NotificationsPage scope="admin" items={await adminNotifications()} />
}
