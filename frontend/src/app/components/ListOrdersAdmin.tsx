"use client";
import React, { useState } from "react";
import {
  Download,
  Eye,
  Package,
  Laptop,
  Mouse,
  Headphones,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import dayjs from "dayjs";
interface OrderItemProps {
  id: string;
  price: string;
  product: {
    id: string;
    productName: string;
    description: string;
  };
}

interface OrderProps {
  id: string;
  total_amount: string;
  payment_status: string;
  createdAt: string;
  items: OrderItemProps[];
}

const ListOrdersAdmin = ({ orders = [] }: { orders?: OrderProps[] }) => {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <>
      <div className="container py-5">
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h3 className="fw-bold mb-1">Quản lý Đơn hàng</h3>
            <p className="text-muted mb-0">
              Theo dõi và quản lý các giao dịch gần đây của bạn.
            </p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <button className="btn btn-primary btn-detail py-2 px-4 shadow-sm">
              <Download size={18} /> Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive table-container p-3">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="border-bottom-2">Mã đơn hàng</th>
                  <th className="border-bottom-2">Ngày đặt</th>
                  <th className="border-bottom-2">Trạng thái</th>
                  <th className="border-bottom-2">Tổng tiền</th>
                  <th className="text-center border-bottom-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className={expandedOrders[order.id] ? "bg-light" : ""}>
                      <td>
                        <span className="order-id text-primary fw-bold">
                          #{order.id}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center text-muted">
                          <Calendar size={14} className="me-2" />
                          {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            order.payment_status === "paid"
                              ? "status-paid"
                              : "status-pending"
                          }`}
                        >
                          {order.payment_status === "paid"
                            ? "Đã thanh toán"
                            : "Chờ thanh toán"}
                        </span>
                      </td>
                      <td>
                        <span className="amount fw-semibold">
                          {order.total_amount}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm btn-detail mx-auto"
                          onClick={() => toggleOrder(order.id)}
                        >
                          <Eye size={16} />
                          {expandedOrders[order.id] ? "Đóng" : "Xem sản phẩm"}
                          {expandedOrders[order.id] ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {expandedOrders[order.id] && (
                      <tr className="detail-row">
                        <td colSpan={5} className="p-0 border-0">
                          <div className="p-4 bg-light border-start border-primary border-4 m-3 rounded-3 shadow-sm">
                            <h6 className="fw-bold mb-3 d-flex align-items-center">
                              <Package
                                size={18}
                                className="me-2 text-primary"
                              />
                              Chi tiết sản phẩm đã mua
                            </h6>
                            <div className="table-responsive">
                              <table className="table table-sm product-table bg-white mb-0 shadow-sm border rounded-3 overflow-hidden">
                                <thead className="table-light">
                                  <tr>
                                    <th className="px-3 py-2">ID</th>
                                    <th className="px-3 py-2">Sản phẩm</th>
                                    <th className="px-3 py-2 text-end">Giá</th>
                                    <th className="px-3 py-2 text-center">
                                      Ngày mua
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="px-3 py-2">
                                        <small className="text-muted fw-medium">
                                          {item.id}
                                        </small>
                                      </td>
                                      <td className="px-3 py-2">
                                        <div className="d-flex align-items-center">
                                          <div className="product-img-placeholder me-3">
                                            {item.product.productName.includes(
                                              "MacBook"
                                            ) ? (
                                              <Laptop size={16} />
                                            ) : item.product.productName.includes(
                                                "AirPods"
                                              ) ? (
                                              <Headphones size={16} />
                                            ) : (
                                              <Mouse size={16} />
                                            )}
                                          </div>
                                          <span className="fw-medium text-dark">
                                            {item.product.productName}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-end fw-semibold text-primary">
                                        {item.price}
                                      </td>
                                      <td className="px-3 py-2 text-center text-muted">
                                        {order.createdAt}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .table-container {
          background: white;
        }

        .table thead th {
          color: #8d99ae;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.8px;
          padding: 1rem;
          background: white;
        }

        .table tbody tr:not(.detail-row) {
          border-bottom: 1px solid #f1f3f9;
        }

        .table tbody tr:not(.detail-row):hover {
          background-color: #f8faff;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }

        .status-paid {
          background-color: #e6f9f7;
          color: #0d9488;
        }

        .status-pending {
          background-color: #fff7ed;
          color: #c2410c;
        }

        .btn-detail {
          border-radius: 10px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .product-img-placeholder {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .product-table {
          border-collapse: separate;
          border-spacing: 0;
        }

        .detail-row {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ListOrdersAdmin;
