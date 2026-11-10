import { getMe } from "@/services/auth.server"
import { getUserNotifications } from "@/services/notification.service"
import NotificationsPage from "@/components/modules/notifications/NotificationsPage"

export default async function page() {
    const user = await getMe()
    return (
        <NotificationsPage scope="user" items={await getUserNotifications(user?._id)} />
    )
}
