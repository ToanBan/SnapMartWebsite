import React from "react";
import GetOrders from "@/app/api/business/GetOrders";
import Pagination from "@/app/components/share/Pagination";
import ListOrderBusiness from "@/app/components/ListOrderBusiness";

const OrderPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string }; 
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const orders = await GetOrders(page);
  
  return (
    <div className="container-xl py-5">
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-body p-4">
          <h2 className="h4 fw-bold text-dark mb-4">Danh Sách Đơn Hàng</h2>
          <div className="table-responsive">
            <ListOrderBusiness ordersBusiness={orders} />
          </div>
        </div>
      </div>

      <Pagination 
        page={page} 
        pathName="/business/orders" 
      />
    </div>
  );
};

export default OrderPage;