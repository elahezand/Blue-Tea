import { Spinner } from "@/components/feedback/loader"
import QueryErrorState from "@/components/feedback/queryErrorState"

interface TableStateProps {
    colSpan: number
    isLoading: boolean
    isError: boolean
    isEmpty: boolean
    emptyText: string
    hasNextPage?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage?: () => void
    onRetry?: () => void
    isRetrying?: boolean
}

export default function TableState({ colSpan, isLoading, isError, isEmpty, emptyText, hasNextPage, isFetchingNextPage, fetchNextPage, onRetry, isRetrying }: TableStateProps) {
    if (isLoading) return <tr><td colSpan={colSpan} className="!py-10 text-center text-muted"><Spinner label="Loading" /></td></tr>
    if (isError && isEmpty) return <tr><td colSpan={colSpan} className="!max-w-none"><QueryErrorState compact title="Couldn't load this list" onRetry={onRetry} isRetrying={isRetrying} /></td></tr>
    if (isEmpty) return <tr><td colSpan={colSpan} className="!py-10 text-center text-muted">{emptyText}</td></tr>
    if (!hasNextPage) return null
    return (
        <tr>
            <td colSpan={colSpan} className="!py-4 text-center">
                <button type="button" onClick={() => fetchNextPage?.()} disabled={isFetchingNextPage} className="btn-ghost">
                    {isFetchingNextPage ? <Spinner label="Loading" /> : "Load more"}
                </button>
            </td>
        </tr>
    )
}
