import type { ReactNode } from "react";
import Navbar from "@/components/modules/navbar/navbar";
import ScrollToTop from "@/components/modules/scrollTop";
import Footer from "@/components/modules/footer/footer";
export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <ScrollToTop />
            <main id="main">{children}</main>
            <Footer />
        </>
    );
}