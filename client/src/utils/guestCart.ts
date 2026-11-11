import { useSyncExternalStore } from "react"
import { GUEST_CART_KEY } from "@/utils/constant"
import type { GuestCartItem } from "@/types/cart"
export const GUEST_CART_EVENT = "cart-updated"

const notify = (): void => {
    window.dispatchEvent(new Event(GUEST_CART_EVENT))
}

export const getGuestCart = (): GuestCartItem[] => {
    if (typeof window === "undefined") return []
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]")
        if (!Array.isArray(parsed)) return []
        return parsed.filter((i): i is GuestCartItem =>
            !!i && typeof i.product === "string" && Number(i.grams) > 0 && Number(i.quantity) > 0)
    } catch {
        return []
    }
}

const save = (items: GuestCartItem[]): void => {
    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
        notify()
    } catch {
        return
    }
}

export const addToGuestCart = ({ product, grams, quantity = 1 }: Omit<GuestCartItem, "quantity"> & { quantity?: number }): void => {
    const items = getGuestCart()
    const same = items.find((i) => i.product === product && i.grams === grams)
    if (same) same.quantity += quantity
    else items.push({ product, grams, quantity })
    save(items)
}

export const clearGuestCart = (): void => {
    try {
        localStorage.removeItem(GUEST_CART_KEY)
        notify()
    } catch {
        return
    }
}

const subscribe = (onChange: () => void) => {
    const onStorage = (e: StorageEvent) => { if (e.key === GUEST_CART_KEY) onChange() }
    window.addEventListener(GUEST_CART_EVENT, onChange)
    window.addEventListener("storage", onStorage)
    return () => {
        window.removeEventListener(GUEST_CART_EVENT, onChange)
        window.removeEventListener("storage", onStorage)
    }
}

const countPacks = (): number => getGuestCart().reduce((n, item) => n + item.quantity, 0)

export const useGuestCartCount = (): number => useSyncExternalStore(subscribe, countPacks, () => 0)