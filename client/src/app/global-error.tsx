"use client"
import Link from "next/link"
import "./globals.css"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en">
            <body>
                <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
                    <p className="script m-0 text-3xl text-[var(--green)]">Oops, we spilled it</p>
                    <h1 className="mb-3 mt-1 text-3xl text-fg">Something went wrong</h1>
                    <p className="mb-8 max-w-md text-muted">Blue Tea could not open right now. Try again, and if it keeps happening, come back in a few minutes.</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button type="button" onClick={() => reset()} className="classic">Try again</button>
                        <Link href="/" className="btn-ghost">Back to home</Link>
                    </div>
                </main>
            </body>
        </html>
    )
}
