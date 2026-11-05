import Header from "@/components/modules/p-admin/header";
import Sidebar from "@/components/modules/p-admin/sidebar";
import { authAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";
import RefreshAccessToken from "@/utils/refreshAccessToken";
export const metadata = { title: { default: "Admin", template: "%s | Blue Tea admin" }, robots: { index: false, follow: false } }

export default async function AdminPanelLayout({ children }) {
    const admin = await authAdmin()
    if (!admin) {
        redirect("/")
    }
    const content = (
        <div>
            <input
                type="checkbox"
                id="hamburger"
                className="peer hidden"
            />
            <label htmlFor="hamburger" aria-label="Toggle menu"
                className="fixed top-3 z-[1001] flex size-10 cursor-pointer items-center justify-center rounded-full border border-solid border-white/25 bg-[var(--navy)] shadow-md transition-all duration-300 hover:brightness-125 max-lg:left-3 max-lg:peer-checked:left-[206px] lg:left-[206px] lg:peer-checked:left-3">
                <span className="relative block h-[2px] w-[18px] rounded bg-[var(--cream)] before:absolute before:-top-[6px] before:left-0 before:h-[2px] before:w-full before:rounded before:bg-[var(--cream)] after:absolute after:top-[6px] after:left-0 after:h-[2px] after:w-full after:rounded after:bg-[var(--cream)]" />
            </label>
            <div className="fixed top-0 left-0 z-[1000] h-screen w-[260px] overflow-y-auto bg-[var(--navy)] pt-12 pr-4 pl-4 text-[var(--cream)] transition-transform duration-400 ease-in-out max-lg:-translate-x-full max-lg:peer-checked:translate-x-0 lg:peer-checked:-translate-x-[270px]">
                <Sidebar />
            </div>
            <div className="ml-[250px] min-h-screen lg:peer-checked:[&_.ptitle]:ps-12 max-lg:[&_.ptitle]:ps-12 max-lg:peer-checked:[&_.ptitle]:ps-0 px-4 py-2 transition-all sm:px-10 duration-300 ease-in-out peer-checked:ml-0 peer-checked:w-full max-lg:ml-0">
                <Header />
                <div className="w-full sm:px-3">
                    {children}
                </div>
            </div>
        </div>
    );


    if (admin.status === "expired") {
        return (
            <RefreshAccessToken
             shouldRefresh={true}>
              {content}
            </RefreshAccessToken>
        );
    }
    return content;
}





