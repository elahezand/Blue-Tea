import React from 'react'
import styles from "@/styles/contact-us.module.css"
import { FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import ContactForm from '@/components/template/contact/contactForm';

export const metadata = {
    title: "Contact Us - Tea Shop",
    description: "Get in touch with Tea Shop. Reach out for questions, feedback, or support. We'd love to hear from you!",
    keywords: ["Tea Shop", "Contact", "Support", "Feedback", "Customer Service"],
    authors: [{ name: "Tea Shop Team" }],
    openGraph: {
        title: "Contact Us - Tea Shop",
        description: "Get in touch with Tea Shop. Reach out for questions, feedback, or support.",
        url: "https://yourwebsite.com/contact",
        siteName: "Tea Shop",
        images: [
            {
                url: "https://yourwebsite.com/images/contact-og.jpg",
                width: 1200,
                height: 630,
                alt: "Contact Tea Shop",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us - Tea Shop",
        description: "Get in touch with Tea Shop. Reach out for questions, feedback, or support.",
        images: ["https://yourwebsite.com/images/contact-og.jpg"],
    },
};
export default async function page() {

    return (
        <div className='container-fluid m-0'>
            <div className="header">
                <h1>Contact Us</h1>
                <p>Wed love to hear from you! Reach out with any questions or feedback.</p>
            </div>
            <div className={`${styles.container} my-5`}>
                <div className="row g-5 justify-content-center align-items-center">
                    <div className="col-lg-6">
                        <ContactForm />
                    </div>
                    <div className="col-lg-5">
                        <div className={`${styles.contact_info} p-5 rounded-4`}>
                            <div className="mb-3 d-flex align-items-center">
                                <FaMapMarkerAlt className="me-2" />
                                <span>123 Tea Street, Green City, Earth</span>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <FaEnvelope className="me-2" />
                                <span>info@teashop.com</span>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <FaPhone className="me-2" />
                                <span>+123 456 7890</span>
                            </div>
                            <div className="mt-4">
                                <h5>Follow Us</h5>

                                <ul className="social-icon mt-4">
                                    <li className={styles.social_icon__item}>
                                        <IoLogoWhatsapp />
                                    </li>
                                    <li className={styles.social_icon__item}>
                                        <FaTwitter />
                                    </li>
                                    <li className={styles.social_icon__item}>
                                        <FaFacebook />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}
