import React from "react";
import {
  CheckCircle2,
  Stars,
  Heart,
  CreditCard,
  Truck,
  ArrowLeft,
  Printer,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import GetOrdersDetail from "@/app/api/users/GetOrderDetail";
import dayjs from "dayjs";
import TrackProductBuy from "@/app/components/TrackProductBuy";
const SuccessPage = async ({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) => {
  const orderId = searchParams.orderId;

  const order = await GetOrdersDetail(orderId || "");
  console.log("Order Details:", order);
  const productsIds = order.items.map((item: any) => item.id);

  console.log(productsIds);

  return (
    <>
      <TrackProductBuy productsIds={productsIds}/>

      <div
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3"
        style={{ marginTop: "5rem" }}
      >
        <style>{`
        :root {
            --primary-success: #00b894;
            --primary-hover: #00a383;
            --text-dark: #2d3436;
            --text-muted: #636e72;
        }

        .success-card {
            background: #ffffff;
            border: none;
            border-radius: 28px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
            animation: slideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .check-container {
            width: 90px;
            height: 90px;
            background: rgba(0, 184, 148, 0.12);
            color: var(--primary-success);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }

        @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .order-details-box {
            background-color: #fafafa;
            border: 2px dashed #edf2f7;
            border-radius: 20px;
            padding: 24px;
        }

        .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 0.95rem;
            color: var(--text-muted);
        }

        .total-row {
            border-top: 2px solid #f1f1f1;
            margin-top: 16px;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            font-weight: 800;
            font-size: 1.25rem;
            color: var(--primary-success);
        }

        /* Fixed Button Colors */
        .btn-success-custom {
            background-color: var(--primary-success) !important;
            color: white !important;
            border: none !important;
            border-radius: 14px !important;
            padding: 14px 28px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-success-custom:hover {
            background-color: var(--primary-hover) !important;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 184, 148, 0.25);
        }

        .btn-outline-custom {
            background-color: #fff !important;
            color: var(--text-dark) !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 14px !important;
            padding: 14px 28px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-outline-custom:hover {
            background-color: #f8fafc !important;
            border-color: var(--text-dark) !important;
            transform: translateY(-3px);
        }

        .confetti {
            position: absolute;
            pointer-events: none;
        }

        @media print {
            .no-print { display: none !important; }
            body { background: white; padding: 0; }
            .success-card { box-shadow: none; border: 1px solid #eee; margin: 0 auto; }
        }
      `}</style>

        <div className="success-card p-4 p-md-5 position-relative">
          {/* Decorative elements */}
          <Stars
            className="confetti text-warning"
            style={{ top: "10%", left: "8%" }}
            size={24}
          />
          <Heart
            className="confetti text-danger"
            style={{ top: "15%", right: "10%" }}
            size={20}
          />
          <ShoppingBag
            className="confetti text-primary opacity-25"
            style={{ bottom: "20%", left: "5%" }}
            size={32}
          />

          <div className="text-center mb-5">
            <div className="check-container">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h1 className="fw-bold h2 mb-2 text-dark">
              Thanh toán thành công!
            </h1>
          </div>

          <div className="order-details-box mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <div>
                <span className="d-block text-uppercase small fw-bold text-muted ls-wide">
                  Mã đơn hàng
                </span>
                <span className="fw-bold text-dark">SM - {order.id}</span>
              </div>
              <div className="text-end">
                <span className="d-block text-uppercase small fw-bold text-muted ls-wide">
                  Ngày đặt
                </span>
                <span className="fw-medium">
                  {dayjs(order.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>

            {order.items.map((item: any) => (
              <div key={item.id} className="item-row">
                <span>{item.product.productName}</span>
                <span className="fw-bold text-dark">
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            ))}

            <div className="total-row">
              <span>Tổng cộng</span>
              <span>
                {order.total_amount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-sm-6 text-start">
              <div className="d-flex gap-2 align-items-center mb-1 text-muted small fw-bold text-uppercase">
                <Truck size={14} /> Giao hàng
              </div>
              <p className="mb-0 fw-bold text-dark">
                Dự kiến:{" "}
                {dayjs(order.createdAt).add(2, "days").format("DD/MM/YYYY")}
              </p>
            </div>
          </div>

          <div className="d-grid gap-3 d-sm-flex justify-content-center no-print">
            <Link href={"/shop"}>
              <button className="btn btn-outline-custom flex-grow-1">
                <ArrowLeft size={18} />
                <span>Mua sắm tiếp</span>
              </button>
            </Link>
            <button className="btn btn-success-custom flex-grow-1">
              <Printer size={18} />
              <span>In hóa đơn</span>
            </button>
          </div>

          <div className="text-center mt-5 no-print">
            <a
              href="#"
              className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 hover-dark"
            >
              <HelpCircle size={14} />
              Bạn cần hỗ trợ? Liên hệ trung tâm khách hàng
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
