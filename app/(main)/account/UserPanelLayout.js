import { authUser } from "@/utils/auth";
import connectToDB from "@/configs/db";
import UserProvider from "@/utils/context/userProvider";
import Dropdown from "@/utils/dropDown";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "@/components/modules/p-admin/sidebar.module.css"
import RefreshAccessToken from "@/utils/refreshAccessToken";
import Logout from "@/components/modules/logOut/logout";
import Image from "next/image";
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
                        <div className="card-body py-2 d-flex align-items-center">
                            <Image
                                src={user.avatar || "/images/default-avatar.png"}
                                width={70}
                                height={70}
                                className="rounded-circle border border-2"
                                style={{ borderColor: 'var(--brown-light)' }}
                                alt="User avatar"
                            />
                            <div className="ms-3">
                                <h6 className="fw-bold fs-4 mb-1 text-white">{user.name}</h6>
                                <p className="small text-white mb-0">{user.email}</p>
                            </div>
                        </div>
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
                                ]} />
                            <Dropdown
                                icon="bi-people-fill"
                                title="account-Detail"
                                items={[
                                    { label: "Your Info", href: "/account/detail" }
                                ]}
                            />
                        </ul>
                    </div>
                   <Logout/>
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




