"use client";
import { MdOutlineArticle, MdOutlineChat, MdOutlineDashboard, MdOutlineEventAvailable, MdOutlineForum, MdOutlineInventory2, MdOutlineLocalOffer, MdOutlinePeopleAlt, MdOutlineSupportAgent } from "react-icons/md"
import Dropdown, { NavLink } from "@/components/modules/dropDown";
import Logo from "@/components/modules/logo";
import Logout from "../logOut/logout";
export default function Sidebar() {
    return (
        <div>
            <div className="px-2">
                <Logo light size={34} className="text-[var(--cream)]" />
                <span className="script mt-1 block text-2xl text-[var(--lamp)]">Admin panel</span>
            </div>
            <div className="mt-8">
                <ul className="list-none ps-0">
                    <ul className="list-none ps-0">
                        <NavLink exact tone="dark" icon={<MdOutlineDashboard />} title="Dashboard" href="/p-admin" />

                        <Dropdown tone="dark"
                            icon={<MdOutlineInventory2 />}
                            title="Products"
                            items={[
                                { label: "All Products", href: "/p-admin/products" },
                                { label: "Create Product", href: "/p-admin/products/create" },
                            ]}
                        />

                        <Dropdown tone="dark"
                            icon={<MdOutlineForum />}
                            title="Menu"
                            items={[
                                { label: "Menu Items", href: "/p-admin/menu" },
                                { label: "Create Menu Item", href: "/p-admin/menu/create" },
                            ]}
                        />

                        <Dropdown tone="dark"
                            icon={<MdOutlinePeopleAlt />}
                            title="Users"
                            items={[
                                { label: "All Users", href: "/p-admin/users" },
                                { label: "Create New User", href: "/p-admin/users/create" },

                            ]}
                        />

                        <Dropdown tone="dark"
                            icon={<MdOutlineChat />}
                            title="Comments"
                            items={[
                                { label: "All Comments", href: "/p-admin/comments" },
                            ]}
                        />

                        <NavLink tone="dark" icon={<MdOutlineSupportAgent />} title="Tickets" href="/p-admin/tickets" />

                        <Dropdown tone="dark"
                            icon={<MdOutlineChat />}
                            title="Contacts"
                            items={[
                                { label: "All Contacts", href: "/p-admin/contacts" },
                            ]}
                        />

                        <Dropdown tone="dark"
                            icon={<MdOutlineEventAvailable />}
                            title="Reservations"
                            items={[
                                { label: "All Reservations", href: "/p-admin/reservations" },
                            ]}
                        />

                            <Dropdown tone="dark"
                            icon={<MdOutlineArticle />}
                            title="Orders"
                            items={[
                                { label: "All orders", href: "/p-admin/orders" },

                            ]}
                        />
                        <Dropdown tone="dark"
                            icon={<MdOutlineArticle />}
                            title="Articles"
                            items={[
                                { label: "All articles", href: "/p-admin/articles" },
                                { label: "Create New Article", href: "/p-admin/articles/create" },

                            ]}
                        />
                        <Dropdown tone="dark"
                            icon={<MdOutlineForum />}
                            title="Detail Account"
                            items={[
                                { label: "Detail Account", href: "/p-admin/detail-account" },
                            ]}
                        />

                        <NavLink tone="dark" icon={<MdOutlineLocalOffer />} title="Discounts" href="/admin/discounts" />

                    </ul>
                </ul>
            </div>
          <Logout tone="dark" />
        </div>
    )
}




