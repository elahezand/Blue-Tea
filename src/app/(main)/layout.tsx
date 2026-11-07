import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import ScrollToTop from "@/components/modules/scrollTop";
import Footer from "@/components/modules/footer/footer";

const Navbar = dynamic(() => import("@/components/modules/navbar/navbar"))

export default function clientLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <ScrollToTop />
            <div>{children}</div>
            <Footer />
        </>
    );
}
