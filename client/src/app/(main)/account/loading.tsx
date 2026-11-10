import { CardListSkeleton } from "@/components/feedBack/Skeletons"
export default function Loading() {
    return (
        <div className="container pt-10 pb-16">
            <div className="mb-8 h-24 animate-pulse rounded-3xl bg-soft/60" />
            <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
                <div className="hidden h-72 animate-pulse rounded-3xl border-2 border-dashed border-line bg-surface lg:block" />
                <CardListSkeleton />
            </div>
        </div>
    )
}
