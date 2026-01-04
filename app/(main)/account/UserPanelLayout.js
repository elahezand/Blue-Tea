import { authUser } from "@/utils/auth";
import connectToDB from "@/db/db";
import UserProvider from "@/utils/context/userProvider";
import Dropdown from "@/utils/dropDown";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "@/components/modules/p-admin/sidebar.module.css"
import RefreshAccessToken from "@/utils/refreshAccessToken";
import { MdLogout } from "react-icons/md";
export default async function UserPanelLayout({ children }) {
    await connectToDB()
    const user = await authUser()
    if (!user) {
        redirect("/")
    }

    const safeUser = JSON.parse(JSON.stringify(user));
    
    const content = (
        <div className="container-fluid py-5">
            <div className="row gap-5">
                <div className="col-3">
                    <div className="d-flex align-items-center justify-content-between justify-content-lg-center">
                        <span className="text-white">WelCome To Your Dashboard</span>
                    </div>
                    <div className="mt-5">
                        <ul className="list-unstyled">
                            <li className={`${styles.sidebar_item} ${styles.active}`}>
                                <Link className={styles.sidebar_link} href="/account">
                                    <i className="me-2 bi bi-grid-fill"></i>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <Dropdown
                                icon="bi-box-seam"
                                title="orders"
                                items={[
                                    { label: "All Orders", href: "/account/orders" },
                                ]}
                            />
                            <Dropdown
                                icon="bi-chat-right-dots-fill"
                                title="reservations"
                                items={[
                                    { label: "All Reservations", href: "/account/reservations" },
                                ]}
                            />
                                <Dropdown
                                icon="bi-people-fill"
                                title="comments"
                                items={[
                                    { label: "All comments", href: "/account/comments" }
                                ]}/>
                            <Dropdown
                                icon="bi-people-fill"
                                title="account-Detail"
                                items={[
                                    { label: "Your Info", href: "/account/detail" }
                                ]}
                            />
                        </ul>
                    </div>
                    <div className="text-white d-flex gap-2 my-5 fs-5 align-items-center">
                        <MdLogout />
                        EXIT
                    </div>
                </div>
                <div
                    className="col-8">
                    {children}
                </div>
            </div>
        </div>
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




