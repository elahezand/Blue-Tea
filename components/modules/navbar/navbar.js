import connectToDB from '@/db/db';
import { getMe } from '@/utils/auth';
import ShoppingCartIcon from './shoppingCartIcon';
import { handleTree } from '@/utils/tree';
import WishlistModal from '@/model/wishList';
import { AiOutlineHeart } from "react-icons/ai";
import Image from 'next/image'
import Link from 'next/link';
import styles from "./navbar.module.css"


export default async function Navbar() {
    connectToDB()
    const user = await getMe()
    const tree = await handleTree()
    const categories = tree?.[0]?.children || [];

    const wishlist = await WishlistModal.findOne({ user: user.id })
    const favoritesCount = wishlist?.products?.length || 0

    return (
        <div className="container-fluid bg-white sticky-top">
            <div className="container">
                <nav className="navbar navbar-expand-lg bg-white navbar-light py-2 py-lg-0">
                    <Link href="index.html" className={styles.navbar_brand}>
                        <Image
                            width={100}
                            height={100}
                            className="img-fluid"
                            src="/images/b67706a7-8ec4-4706-b58d-a889093e4988_removalai_preview.png"
                            alt="Logo"
                        />
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className={`navbar-nav ms-auto ${styles.container_nav}`}>
                            <Link href="/" className="nav-item nav-link">Home</Link>
                            <Link href="/about" className="nav-item nav-link">About</Link>
                            <Link href="#menu" className="nav-item nav-link">Menu</Link>
                            <div className={`nav-item dropdown ${styles.nav_item}`}>
                                <Link href="/products"
                                    className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                    Store
                                </Link>
                                <div className="dropdown-menu bg-light rounded-0 m-0">
                                    {categories.map((cat, index) => (
                                        <Link
                                            key={index + 1}
                                            href={`/products?category=${cat.name}`}
                                            className="dropdown-item"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <Link
                                href={"/contact-us"}
                                className="nav-item nav-link">Contact</Link>
                            <Link
                                href="#reservation"
                                style={{ color: "var(--brown-light)" }}
                                className={styles.btn}>
                                reservation</Link>
                        </div>
                    </div>
                    {user === null ? (
                        <Link href="/login-register" className={styles.btn}>SignUp/SignIn</Link>
                    ) : (
                        <Link
                            href={"/account"}
                            className={styles.btn}>{user.name}</Link>
                    )}
                    <div className="border-start ps-4 d-none d-lg-flex align-items-center gap-3 ms-5">
                        <Link
                            className="position-relative"
                            href="/favorites">
                            <AiOutlineHeart color='#000' size={24} />
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                style={{ fontSize: "0.75rem", backgroundColor: "var(--brown-light)" }}  >
                                {favoritesCount}
                            </span>
                        </Link>
                        <ShoppingCartIcon />
                    </div>
                </nav>
            </div>
        </div>

    )
}
