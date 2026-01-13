"use client";

import React, { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  FileText,
  CreditCard,
} from "lucide-react";
import ReceiveOrder from "../api/users/ReceiveOrder";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
import TransactionCod from "../api/users/TransactionCod";
import dayjs from "dayjs";
const TrackingOrder = ({ order }: { order: any }) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);
  const CheckStatus = (status: string, step: number) => {
    if (status === "pending") {
      return step === 1 ? "active" : "";
    } else if (status === "approval") {
      return step === 2 ? "active" : step < 2 ? "completed" : "";
    } else if (status === "shipping") {
      return step === 3 ? "active" : step < 3 ? "completed" : "";
    }
    return step <= 4 ? "completed" : "";
  };

  const handlePayment = async() => {
    const result = await TransactionCod(order.id);
    window.location.href = result.checkoutUrl
    
  };

  const handleReceive = async () => {
    const data = await ReceiveOrder(currentOrder.id);
    if (data && data.success) {
      setCurrentOrder(data.message);
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
        setCurrentStatus("delivered");
      }, 2000);
    } else {
      setError(true);
    }
  };

  console.log(currentOrder);

  return (
    <>
      {currentStatus === "shipping" && (
        <div className="mt-3 d-flex justify-content-end gap-2">
          {currentOrder.payment_status === "pending" ? (
            <button onClick={handlePayment} className="btn btn-pay">
              <CreditCard size={18} className="me-2" />
              Thanh toán ngay
            </button>
          ) : (
            <button onClick={handleReceive} className="btn btn-receive">
              Nhận hàng
            </button>
          )}
        </div>
      )}

      <div className="order-header d-md-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-1">Mã đơn hàng: #SM-{order.id}</h4>
          <p className="text-muted mb-0">
            Đặt vào ngày: {dayjs(order.createdAt).format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <span className="status-badge badge-shipping">
            <i className="bi bi-truck me-2"></i>{currentOrder.status === "delivered" ? "Hoàn Thành": "Đang Vận Chuyển"}
          </span>
        </div>
      </div>

      <div className="track-container">
        <div className="track-steps">
          <div className="track-progress-bar"></div>

          <div className={`step-item ${CheckStatus(currentOrder.status, 1)}`}>
            <div className="step-icon">
              <FileText size={24} />
            </div>
            <div className="step-text">Đã xác nhận</div>
          </div>

          <div className={`step-item ${CheckStatus(currentOrder.status, 2)}`}>
            <div className="step-icon">
              <Package size={24} />
            </div>
            <div className="step-text">Đóng gói</div>
          </div>

          <div className={`step-item ${CheckStatus(currentOrder.status, 3)}`}>
            <div className="step-icon">
              <Truck size={24} />
            </div>
            <div className="step-text">Đang giao</div>
          </div>

          <div className={`step-item ${CheckStatus(currentOrder.status, 4)}`}>
            <div className="step-icon">
              <CheckCircle size={24} />
            </div>
            <div className="step-text">Hoàn thành</div>
          </div>
        </div>
      </div>

      <style>{`.btn-pay {
  padding: 10px 22px;
  border-radius: 999px;
  border: none;

  background: linear-gradient(135deg, #0d6efd, #6610f2);
  color: #fff;
  font-weight: 600;
  font-size: 14px;

  box-shadow: 0 8px 22px rgba(13, 110, 253, 0.35);
  transition: all 0.3s ease;
}

.btn-pay:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(13, 110, 253, 0.5);
  color: #fff;
}

.btn-pay:active {
  transform: scale(0.96);
}

.btn-receive {
  padding: 10px 22px;
  border-radius: 999px;
  border: none;

  background: linear-gradient(135deg, #198754, #20c997);
  color: #fff;
  font-weight: 600;
  font-size: 14px;

  box-shadow: 0 8px 22px rgba(25, 135, 84, 0.35);
  transition: all 0.3s ease;
}

.btn-receive:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(25, 135, 84, 0.5);
  color: #fff;
}

.btn-receive:active {
  transform: scale(0.96);
}

`}</style>
    </>
  );
};

export default TrackingOrder;
