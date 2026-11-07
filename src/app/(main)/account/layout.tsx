import type { ReactNode } from "react"
export const metadata = { title: "My account", robots: { index: false, follow: false } }
export default function Layout({ children }: { children: ReactNode }) { return children }
