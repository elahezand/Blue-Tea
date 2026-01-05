import React from "react";
import Table from "@/components/modules/table/Table";
import connectToDB from "@/db/db";
import { paginate } from "@/utils/helper";
import { FaRegEdit } from "react-icons/fa";
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
    paginatedData = await paginate(orderModal, searchParams, {}, "user")
  }


  return (
    <>
      {id ? (
        <div className="transparentCard">
          <div className="row justify-content-between align-items-start">
            <div className="col-lg-6">
              <span className="edit">Address</span>
              <br />
              <div>
                <span className="fw-bold">City:</span>
                <span className="mx-1"> {order.shippingAddress.city}</span>
              </div>
              <span className="mx-1">{order.shippingAddress.address}</span>
              <div>
                <span className="fw-bold">
                  PostalCode:
                </span>
                <span className="mx-1">
                  {order.shippingAddress.postalCode}
                </span>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="edit">Items</span>
              <br />
              {order.items.map((p, index) => (
                <div key={index}>
                  <div>
                    <span className="fw-bold"> Title :</span>
                    <span className="mx-1"> {p.title}</span>
                  </div>
                  <div>
                    <span className="fw-bold"> Price :</span>
                    <span className="mx-1"> ${p.price}</span>
                  </div>
                  <div>
                    <span className="fw-bold"> Qty :</span>
                    <span className="mx-1"> {p.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
            <Table title={"All Orders"}>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Status</th>
                <th>Payment</th>
                <th>IsPaid</th>
                <th>Date</th>
                <th>Total</th>
                <th>
                  <FaRegEdit />
                </th>
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
