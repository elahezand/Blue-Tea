/* One loading state for the whole site: a cup with rising steam.
   <Loader />                 full area (route changes, page data)
   <Loader inline label=".."/> a quiet line inside a section
   <Spinner />                tiny, for buttons */
export default function Loader({ label = "Brewing", inline = false, className = "" }) {
    const size = inline ? 44 : 72
    return (
        <div role="status" aria-live="polite"
            className={`flex flex-col items-center justify-center gap-3 text-center ${inline ? "py-10" : "min-h-[60vh]"} ${className}`}>
            <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <circle cx="24" cy="24" r="24" fill="var(--logo, var(--accent))" />
                <path className="loader-steam" d="M19 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" />
                <path className="loader-steam loader-steam-2" d="M28 22c-3-3 3-5 0-9" stroke="#6fbf8a" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M13 26h22v1.5A11 11 0 0 1 24 38.5 11 11 0 0 1 13 27.5V26Z" fill="#fff" />
                <path d="M35 28.5h1.5a3 3 0 0 1 0 6H33" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <rect x="15" y="40.5" width="18" height="2" rx="1" fill="#fff" opacity=".85" />
            </svg>
            <span className="script text-2xl text-[var(--green)]">{label}<span className="loader-dots" aria-hidden="true">...</span></span>
            <span className="sr-only">Loading</span>
        </div>
    )
}

export function Spinner({ label }) {
    return (
        <span className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block size-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent [animation-duration:.7s]" />
            {label}
        </span>
    )
}
