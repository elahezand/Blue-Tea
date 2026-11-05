import Image from "next/image";
import ThemeToggle from "@/components/modules/themeToggle";
import { getMe } from "@/utils/auth";
import PanelTitle from "@/components/modules/p-admin/panelTitle";
import NotificationBell from "@/components/modules/notifications/NotificationBell";
import { adminNotifications } from "@/components/modules/notifications/getNotifications";

export default async function Topbar() {
    const [me, notes] = await Promise.all([getMe(), adminNotifications()])
    return (
        <div className="mb-8 flex w-full items-center justify-between gap-4 border-b-2 border-dotted border-line pb-5 pt-8">
            <PanelTitle />
            <div className="flex items-center gap-3 text-fg">
                <NotificationBell scope="admin" items={notes} allHref="/p-admin/notifications" />
                <ThemeToggle onPage />
                <div className="flex items-center gap-3">
                    {me.avatar ? (
                        <Image height={80} width={80} src={me.avatar} className="size-10 rounded-full object-cover" alt="" />
                    ) : null}
                    <div className="hidden leading-tight sm:block">
                        <p className="m-0 text-sm font-medium">{me.name}</p>
                        <span className="text-xs capitalize text-muted">{me.role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
