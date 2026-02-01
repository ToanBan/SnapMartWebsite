import React from "react";
import {
  Package,
  Truck,
  CheckCircle,
  FileText,
  Calendar,
  ShoppingBag,
  Download,
  Filter,
} from "lucide-react";
import GetOrders from "@/app/api/users/GetOrders";
import Link from "next/link";
import dayjs from "dayjs";
const OrderPage = async () => {
  const orders = await GetOrders();
  return (
    <>
      <style>
        {` 
        
        .order-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .order-header {
            background-color: #ffffff;
            padding: 1.25rem;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .order-id {
            font-weight: 600;
            color: var(--primary-color);
            font-size: 1rem;
        }
        .order-date {
            font-size: 0.875rem;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .order-body {
            padding: 1.25rem;
        }
        .item-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .icon-box {
            width: 48px;
            height: 48px;
            background: #eef2ff;
            color: var(--primary-color);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .order-stats {
            display: flex;
            gap: 2rem;
            margin-top: 0.5rem;
        }
        .stat-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            color: var(--text-muted);
            display: block;
        }
        .stat-value {
            font-weight: 600;
            font-size: 1.1rem;
        }
        .badge-custom {
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-weight: 500;
            font-size: 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
        }
        .status-paid {
            background-color: #dcfce7;
            color: #15803d;
        }
        .status-pending {
            background-color: #fef9c3;
            color: #a16207;
        }
        .status-failed {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .order-card {
            background: #ffffff;
            border: none;
            border-radius: 16px;
            box-shadow: var(--card-shadow);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        .page-header {
            margin-bottom: 2.5rem;
        }
        .page-title {
            font-weight: 700;
            font-size: 1.75rem;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .btn-detail {
            border: 1px solid #e2e8f0;
            background: white;
            color: var(--text-main);
            padding: 0.5rem 1.25rem;
            border-radius: 10px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
        }
        .btn-detail:hover {
            background: #f8fafc;
            border-color: #cbd5e1;
        }
        @media (max-width: 576px) {
            .order-stats {
                gap: 1rem;
                flex-direction: column;
            }
            .order-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .order-action {
                width: 100%;
                text-align: right;
            }
        }
      `}
      </style>

      <div className="container" style={{ marginTop: "8rem" }}>
        <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="page-title">
              <ShoppingBag size={32} color="#4f46e5" /> Lịch Sử Đơn Hàng
            </h1>
            <p className="text-muted mb-0">
              Quản lý và theo dõi các đơn hàng bạn đã mua
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-detail d-flex align-items-center gap-2">
              <Filter size={18} /> Lọc
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              style={{
                backgroundColor: "var(--primary-color)",
                border: "none",
                borderRadius: "10px",
              }}
            >
              <Download size={18} /> Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {orders.length !== 0 ? (
              orders.map((order: any) => (
                <div key={order.id} className="order-card card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">#SM-${order.id}</span>
                      <div className="order-date mt-1">
                        <Calendar size={14} /> {dayjs(order.createdAt).format("HH:mm - DD [Tháng] MM, YYYY")}
                      </div>
                    </div>
                    <div className="order-status">
                      {order.payment_status === "paid" ? (
                        <span className="badge-custom status-paid">
                        <CheckCircle size={14} /> Đã thanh toán
                      </span>
                      ):(
                        <span className="badge-custom status-failed">
                        <CheckCircle size={14} /> Chưa Thanh Toán
                      </span>
                      )}
                    </div>
                  </div>
                  <div className="order-body">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <div className="order-stats">
                          <div>
                            <span className="stat-label">Sản phẩm</span>
                            <div className="item-info">
                              <div className="icon-box">
                                <Package size={24} />
                              </div>
                              <span className="stat-value">{order.itemCount} món hàng</span>
                            </div>
                          </div>
                          <div>
                            <span className="stat-label">Tổng thanh toán</span>
                            <span className="stat-value text-dark">
                              {order.total_amount.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <Link href={`/orders/${order.id}`}>
                          <button className="btn btn-detail">
                            Xem chi tiết
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">
                Bạn chưa có đơn hàng nào.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
