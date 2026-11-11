import type { RouteProps } from "@/types/api"
import OrderDetail from "@/components/template/p-admin/orders/orderDetail"

export default async function page({ params }: Pick<RouteProps<{ id: string }>, "params">) {
    const { id } = await params
    return <OrderDetail id={id} />
}
