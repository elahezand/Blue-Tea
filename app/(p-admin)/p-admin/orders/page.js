import "@/model/user"
import React from "react";
import Table from "@/components/modules/table/Table";
import TableToolbar from "@/components/modules/p-admin/TableToolbar";
import { orderFilters } from "@/components/modules/p-admin/tableFilters";
import connectToDB from "@/configs/db";
import { paginate } from "@/utils/helper";
import orderModal from "@/model/order";
import OrdersList from "@/components/template/p-admin/orders/ordersList";
import Pagination from "@/components/modules/pagination/pagination";

export default async function Page({ searchParams }) {
  await connectToDB()
  const { id } = await searchParams
  let paginatedData = null
  let order = null

  if (id) {
    order = await orderModal.findById(id).lean();
    if (!order) return <div>Order not found</div>;
  } else {
    paginatedData = await paginate(orderModal, await searchParams, {}, "user")
  }


  return (
    <>
      {id ? (
        <div className="transparentCard">
          <div className="-mx-3 flex flex-wrap items-start justify-between">
            <div className="w-full shrink-0 px-3 lg:w-1/2">
              <span className="edit">Address</span>
              <br />
              <div>
                <span className="font-bold">City:</span>
                <span className="mx-1"> {order.shippingAddress.city}</span>
              </div>
              <span className="mx-1">{order.shippingAddress.address}</span>
              <div>
                <span className="font-bold">
                  PostalCode:
                </span>
                <span className="mx-1">
                  {order.shippingAddress.postalCode}
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
      ) : (
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
            <OrdersList data={JSON.parse(JSON.stringify(paginatedData.data))} />
          </Table>
          <Pagination
            href="orders?"
            currentPage={paginatedData.page}
            pageCount={paginatedData.pageCount}
            limit={paginatedData.limit}
          />
        </>
      )}
    </>
  );
}
