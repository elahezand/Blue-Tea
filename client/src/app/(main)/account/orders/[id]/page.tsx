import type { RouteProps } from "@/types/api"
import { notFound } from "next/navigation"
import { isValidObjectId } from "@/utils/helper"
import OrderDetail from "@/components/template/account/orders/orderDetail"

export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params
    if (!isValidObjectId(id)) notFound()
    return <OrderDetail id={id} />
}
