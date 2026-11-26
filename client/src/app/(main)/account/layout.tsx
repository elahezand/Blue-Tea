import type { ReactNode } from "react";
import AuthGuard from "@/components/modules/auth/authGuard";
import ProfileSummary from "@/components/modules/auth/profileSummary";
import { MdOutlineDashboard, MdOutlineEventAvailable, MdOutlineForum, MdOutlineInventory2, MdOutlinePeopleAlt, MdOutlineSupportAgent } from "react-icons/md"
import { NavLink } from "@/components/modules/dropDown";
import Logout from "@/components/modules/logout/logout";
import NotificationBell from "@/components/modules/notifications/notificationBell";
import AccountHeader from "@/components/template/account/accountHeader";

export const metadata = { title: { default: "My account", template: "%s | My account" }, robots: { index: false, follow: false } }

export default function AccountLayout({ children }: { children: ReactNode }) {
    const content = (
        <>
        <AccountHeader />
        <div className="container pt-8 pb-16">
            <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4 lg:rounded-3xl">
                        <div className="flex items-center gap-3 rounded-xl border border-line bg-soft p-3">
                            <ProfileSummary />
                            <NotificationBell scope="user" allHref="/account/notifications" popoverClass="right-0 lg:right-auto lg:left-0" />
                        </div>
                        <ul aria-label="Account navigation" className="mt-3 grid list-none grid-cols-2 gap-1 ps-0 sm:grid-cols-3 max-lg:[&>li]:m-0 max-lg:[&>li]:min-w-0 max-lg:[&_a]:gap-1.5 max-lg:[&_a]:px-2 max-lg:[&_a]:text-xs lg:mt-4 lg:block">
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
