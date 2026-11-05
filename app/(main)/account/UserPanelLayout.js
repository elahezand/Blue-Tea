import { authUser } from "@/utils/auth";
import connectToDB from "@/configs/db";
import UserProvider from "@/utils/context/userProvider";
import { MdOutlineDashboard, MdOutlineEventAvailable, MdOutlineForum, MdOutlineInventory2, MdOutlinePeopleAlt, MdOutlineSupportAgent } from "react-icons/md"
import { NavLink } from "@/components/modules/dropDown";
import { redirect } from "next/navigation";
import RefreshAccessToken from "@/utils/refreshAccessToken";
import Logout from "@/components/modules/logOut/logout";
import Image from "next/image";
import { PageHeader } from "@/components/modules/motion";
import NotificationBell from "@/components/modules/notifications/NotificationBell";
import { userNotifications } from "@/components/modules/notifications/getNotifications";
export default async function UserPanelLayout({ children, title = "Your account" }) {
    await connectToDB()
    const user = await authUser()
    if (!user) {
        redirect("/")
    }

    const safeUser = JSON.parse(JSON.stringify(user));
    const notes = await userNotifications(user._id)

    const content = (
        <>
        <PageHeader crumbs={["Account"]} script="Your corner" title={title} />
        <div className="container pt-8 pb-16">
            <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-3xl border-2 border-dashed border-line bg-surface p-5">
                        <div className="flex items-center gap-4">
                            <Image
                                src={user.avatar || "/images/default-avatar.png"}
                                width={64}
                                height={64}
                                className="size-16 rounded-full border border-solid border-line object-cover"
                                alt="User avatar"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="m-0 truncate font-display text-xl" style={{ color: "var(--head)" }}>{user.name}</p>
                                <p className="m-0 truncate text-sm text-muted">{user.email}</p>
                            </div>
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
        <UserProvider user={safeUser}>
            {user.status === "expired" ? (
                <RefreshAccessToken
                    shouldRefresh={true}>
                    {content}
                </RefreshAccessToken>
            ) : (
                content
            )}
        </UserProvider>
    );
}




