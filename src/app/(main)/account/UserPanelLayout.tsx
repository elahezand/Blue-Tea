import type { ReactNode } from "react";
import { getUserNotifications } from "@/services/notification.service";
import AuthGuard from "@/components/modules/auth/AuthGuard";
import ProfileSummary from "@/components/modules/auth/ProfileSummary";
import { MdOutlineDashboard, MdOutlineEventAvailable, MdOutlineForum, MdOutlineInventory2, MdOutlinePeopleAlt, MdOutlineSupportAgent } from "react-icons/md"
import { NavLink } from "@/components/modules/dropDown";
import Logout from "@/components/modules/logOut/logout";
import { PageHeader } from "@/components/modules/motion";
import NotificationBell from "@/components/modules/notifications/NotificationBell";
interface UserPanelLayoutProps {
    children: ReactNode
    title?: string
}

export default async function UserPanelLayout({ children, title = "Your account" }: UserPanelLayoutProps) {
    const notes = await getUserNotifications()

    const content = (
        <>
        <PageHeader crumbs={["Account"]} script="Your corner" title={title} />
        <div className="container pt-8 pb-16">
            <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-3xl border-2 border-dashed border-line bg-surface p-5">
                        <div className="flex items-center gap-4">
                            <ProfileSummary />
                            <NotificationBell scope="user" items={notes} allHref="/account/notifications" popoverClass="right-0 lg:right-auto lg:left-0" />
                        </div>
                        <ul className="mt-5 flex list-none gap-2 overflow-x-auto border-t-2 border-dotted border-line ps-0 pt-3 max-lg:[&>li]:mt-0 max-lg:[&>li]:shrink-0 lg:block lg:overflow-visible">
                            <NavLink exact icon={<MdOutlineDashboard />} title="Dashboard" href="/account" />
                            <NavLink icon={<MdOutlineInventory2 />} title="Orders" href="/account/orders" />
                            <NavLink icon={<MdOutlineEventAvailable />} title="Reservations" href="/account/reservations" />
                            <NavLink icon={<MdOutlineForum />} title="Comments" href="/account/comments" />
                            <NavLink icon={<MdOutlineSupportAgent />} title="Tickets" href="/account/tickets" />
                            <NavLink icon={<MdOutlinePeopleAlt />} title="Account details" href="/account/detail" />
                        </ul>
                        <Logout />
                    </div>
                </aside>
                <div className="min-w-0">
                    {children}
                </div>
            </div>
        </div>
        </>
    );
    return (
        <AuthGuard>
            {content}
        </AuthGuard>
    );
}




