"use client";
import Link from "next/link";
import Dropdown from "@/utils/dropDown";
import styles from "./sidebar.module.css"
import Logout from "../logOut/logout";
export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="d-flex align-items-center justify-content-between justify-content-lg-center">
                <span className="text-white">WelCome To Your Dashboard</span>
            </div>
            <div className="mt-4">
                <ul className="list-unstyled">
                    <ul className="list-unstyled">
                        <li className={`${styles.sidebar_item} ${styles.active}`}>
                            <Link className={styles.sidebar_link} href="/p-admin">
                                <i className="me-2 bi bi-grid-fill"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <Dropdown
                            icon="bi-box-seam"
                            title="Products"
                            items={[
                                { label: "All Products", href: "/p-admin/products" },
                                { label: "Create Product", href: "/p-admin/products/create" },
                            ]}
                        />

                        <Dropdown
                            icon="bi-chat-right-dots-fill"
                            title="Menu"
                            items={[
                                { label: "Menu Items", href: "/p-admin/menu" },
                                { label: "Create Menu Item", href: "/p-admin/menu/create" },
                            ]}
                        />

                        <Dropdown
                            icon="bi-people-fill"
                            title="Users"
                            items={[
                                { label: "All Users", href: "/p-admin/users" },
                                { label: "Create New User", href: "/p-admin/users/create" },

                            ]}
                        />

                        <Dropdown
                            icon="bi-chat-dots-fill"
                            title="Comments"
                            items={[
                                { label: "All Comments", href: "/p-admin/comments" },
                            ]}
                        />

                        <Dropdown
                            icon="bi-chat-dots-fill"
                            title="Contacts"
                            items={[
                                { label: "All Contacts", href: "/p-admin/contacts" },
                            ]}
                        />

                        <Dropdown
                            icon="bi-calendar-check-fill"
                            title="Reservations"
                            items={[
                                { label: "All Reservations", href: "/p-admin/reservations" },
                            ]}
                        />

                            <Dropdown
                            icon="bi-file-earmark-text"
                            title="Orders"
                            items={[
                                { label: "All orders", href: "/p-admin/orders" },

                            ]}
                        />
                        <Dropdown
                            icon="bi-file-earmark-text"
                            title="Articles"
                            items={[
                                { label: "All articles", href: "/p-admin/articles" },
                                { label: "Create New Article", href: "/p-admin/articles/create" },

                            ]}
                        />
                        <Dropdown
                            icon="bi-chat-right-dots-fill"
                            title="Detail Account"
                            items={[
                                { label: "Detail Account", href: "/p-admin/detail-account" },
                            ]}
                        />

                        <li className={styles.sidebar_item}>
                            <Link className={styles.sidebar_link} href="/admin/discounts">
                                <i className="me-2 bi bi-percent"></i>
                                <span>Discounts</span>
                            </Link>
                        </li>

                    </ul>
                </ul>
            </div>
          <Logout/>
        </div>
    )
}




