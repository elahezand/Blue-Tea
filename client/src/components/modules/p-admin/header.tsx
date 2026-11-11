"use client"
import ThemeToggle from "@/components/modules/themeToggle"
import PanelTitle from "@/components/modules/p-admin/panelTitle"
import NotificationBell from "@/components/modules/notifications/notificationBell"
import UserAvatar from "@/components/modules/userAvatar"
import { useProfile } from "@/services/user.service"

export default function Topbar() {
    const { data: me } = useProfile()

    return (
        <div className="mb-8 flex w-full items-center justify-between gap-4 border-b-2 border-dotted border-line pb-5 pt-8">
            <PanelTitle />
            <div className="flex items-center gap-3 text-fg">
                <NotificationBell scope="admin" allHref="/p-admin/notifications" />
                <ThemeToggle onPage />
                <div className="flex items-center gap-3">
                    {me && <UserAvatar name={me.name} src={me.avatar} />}
                    <div className="hidden leading-tight sm:block">
                        <p className="m-0 text-sm font-medium">{me?.name}</p>
                        <span className="text-xs capitalize text-muted">{me?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
