import { emptyPage } from "./empty"
import serverFetch from "./serverFetch"
import { unwrap } from "@/utils/helper"
import { ENDPOINTS } from "@/utils/constant"
import type { ListParams, Paginated } from "@/types/api"
import type { MenuItem, MenuSection } from "@/types/models"

export const getMenu = async (): Promise<MenuSection[]> => {
    try {
        const body = await serverFetch<MenuSection[] | { data: MenuSection[] }>({
            endpoint: ENDPOINTS.MENU,
            cacheKey: "menu",
            revalidateTime: 3600,
        })
        return unwrap(body) ?? []
    } catch {
        return []
    }
}


export const getAdminMenuItems = async (params: ListParams): Promise<Paginated<MenuItem>> => {
    return emptyPage(params)
}
