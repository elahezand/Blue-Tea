import dynamic from "next/dynamic";
import ScrollToTop from "@/components/modules/scrollTop";
import { CartProvider } from "@/utils/context/cartProvider";
import Footer from "@/components/modules/footer/footer";

const Navbar = dynamic(() => import("@/components/modules/navbar/navbar"))

export default function clientLayout({ children }) {
    return (
        <CartProvider>
            <Navbar />
            <ScrollToTop />
            <div>{children}</div>
            <Footer />
        </CartProvider>
    );
}
