import { MdErrorOutline } from "react-icons/md"
import { Spinner } from "./loader"

interface QueryErrorStateProps {
    title?: string
    text?: string
    onRetry?: () => void
    isRetrying?: boolean
    compact?: boolean
}

export default function QueryErrorState({
    title = "Couldn't load this",
    text = "Please check your connection and try again.",
    onRetry,
    isRetrying = false,
    compact = false,
}: QueryErrorStateProps) {
    return (
        <div role="alert" className={`flex flex-col items-center text-center ${compact ? "py-6" : "rounded-[2rem] bg-soft/70 px-6 py-12"}`}>
            <MdErrorOutline aria-hidden className={`mb-2 text-berry ${compact ? "text-3xl" : "text-4xl"}`} />
            <p className={`m-0 font-medium text-fg ${compact ? "text-sm" : "text-lg"}`}>{title}</p>
            <p className="m-0 mb-4 text-sm text-muted">{text}</p>
            {onRetry && (
                <button type="button" onClick={onRetry} disabled={isRetrying} className="btn-ghost">
                    {isRetrying ? <Spinner label="Trying" /> : "Try again"}
                </button>
            )}
        </div>
    )
}
