import NotificationsPage from "@/components/modules/notifications/notificationsPage"

export const metadata = { title: "Notifications" }

export default function page() {
    return <NotificationsPage scope="user" />
}
