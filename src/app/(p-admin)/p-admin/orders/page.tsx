import type { RouteProps } from "@/types/api"
import React from "react";
import Table from "@/components/modules/table/Table";
import TableToolbar from "@/components/modules/p-admin/TableToolbar";
import { orderFilters } from "@/components/modules/p-admin/tableFilters";
import { getAdminOrders, getOrderById } from "@/services/order.service";
import OrdersList from "@/components/template/p-admin/orders/ordersList";
import Pagination from "@/components/modules/pagination/pagination";
import { getParam } from "@/utils/helper";

export default async function Page({ searchParams }: Pick<RouteProps, "searchParams">) {
  const params = await searchParams
  const id = getParam(params.id)

  // ?id=... shows one order
  if (id) {
    const order = await getOrderById(id);
    if (!order) return <div>Order not found</div>;
    const address = order.shippingAddress

    return (
      <div className="transparentCard">
        <div className="-mx-3 flex flex-wrap items-start justify-between">
          <div className="w-full shrink-0 px-3 lg:w-1/2">
            <span className="edit">Address</span>
            <br />
            <div>
              <span className="font-bold">City:</span>
              <span className="mx-1"> {address?.city}</span>
            </div>
            <span className="mx-1">{address?.address}</span>
            <div>
              <span className="font-bold">
                PostalCode:
              </span>
              <span className="mx-1">
                {address?.postalCode}
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 px-3 lg:w-1/2">
            <span className="edit">Items</span>
            <br />
            {order.items.map((p, index) => (
              <div key={index}>
                <div>
                  <span className="font-bold"> Title :</span>
                  <span className="mx-1"> {p.title}</span>
                </div>
                <div>
                  <span className="font-bold"> Price :</span>
                  <span className="mx-1"> ${p.price}</span>
                </div>
                <div>
                  <span className="font-bold"> Qty :</span>
                  <span className="mx-1"> {p.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const paginatedData = await getAdminOrders(params)

  return (
    <>
      <Table title={"All Orders"} toolbar={<TableToolbar fields={orderFilters} />}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <OrdersList data={paginatedData.data} />
      </Table>
      <Pagination
        href="orders?"
        currentPage={paginatedData.page}
        pageCount={paginatedData.pageCount}
        limit={paginatedData.limit}
      />
    </>
  );
}
