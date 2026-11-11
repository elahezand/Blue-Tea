import { Suspense } from "react"
import MenuList from "@/components/template/p-admin/menu/menuList"

export default function page() {
    return (
        <Suspense>
            <MenuList />
        </Suspense>
    )
}
