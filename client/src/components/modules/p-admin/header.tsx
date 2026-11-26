"use client"
import ThemeToggle from "@/components/modules/themeToggle"
import PanelTitle from "@/components/modules/p-admin/panelTitle"
import NotificationBell from "@/components/modules/notifications/notificationBell"
import UserAvatar from "@/components/modules/userAvatar"
import { useProfile } from "@/services/user.service"

export default function Topbar() {
    const { data: me } = useProfile()

    return (
        <header className="mb-8 flex w-full flex-wrap items-center justify-between gap-3 border-b border-line pb-5 pt-8">
            <PanelTitle />
            <div className="ms-auto flex max-w-full items-center gap-2 rounded-xl border border-line bg-soft p-2 text-fg sm:gap-3 sm:px-3">
                <NotificationBell scope="admin" allHref="/p-admin/notifications" />
                <ThemeToggle onPage />
                <div className="flex items-center gap-3">
                    {me && <UserAvatar name={me.name} src={me.avatar} />}
                    <div className="hidden max-w-32 leading-tight sm:block">
                        <p className="m-0 truncate text-sm font-medium">{me?.name}</p>
                        <span className="text-xs capitalize text-muted">{me?.role}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
