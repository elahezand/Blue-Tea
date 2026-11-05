import "./globals.css";
import QueryProvider from "@/utils/react-query-client-provider";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { DM_Sans, Fraunces, Caveat } from "next/font/google";
import RouteSkeleton from "@/components/feedBack/RouteSkeleton";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-next-sans", display: "swap" });
const script = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-next-script", display: "swap" });
const display = Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], variable: "--font-next-display", display: "swap" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Blue Tea | Tea, coffee and a small shop", template: "%s | Blue Tea" },
  description: "Blue Tea is a cafe and shop: book a table, drink tea and coffee made to order, and take the same leaves and brewers home.",
  openGraph: { siteName: "Blue Tea", type: "website" },
};

export const viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#14295a" }, { media: "(prefers-color-scheme: dark)", color: "#12295f" }] };

// Sets the theme before first paint (no flash): saved choice, else system preference
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable} ${script.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-brown focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white">Skip to content</a>
        <Toaster position="top-center" toastOptions={{
          duration: 3500,
          style: { background: "var(--surface)", color: "var(--fg)", border: "1px solid var(--line)", borderRadius: "9999px", padding: "10px 18px", fontSize: "0.9rem", boxShadow: "0 12px 30px -14px rgba(20,41,90,.35)" },
          success: { iconTheme: { primary: "var(--green)", secondary: "#fff" } },
          error: { iconTheme: { primary: "var(--danger)", secondary: "#fff" } },
        }} />
        <QueryProvider>
          <main id="main">
            <Suspense fallback={<RouteSkeleton />}>
              {children}
            </Suspense>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
