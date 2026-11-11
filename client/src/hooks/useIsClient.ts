import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

export default function useIsClient(): boolean {
    return useSyncExternalStore(subscribe, () => true, () => false)
}
