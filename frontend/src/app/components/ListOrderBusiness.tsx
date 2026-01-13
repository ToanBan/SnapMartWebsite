'use client'
import React, { useEffect, useState } from "react";
import HandleStatusOrder from "@/app/api/business/HandleStatusOrder";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
interface ProductProps {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    productName: string;
    description: string;
    image: string;
  };
}

interface OrderProps {
  id: number;
  total_amount: number;
  payment_status: string;
  status: string;
  items: ProductProps[];
  user: {
    username: string;
    avatar: string | null;
  };
}

const ListOrderBusiness = ({
  ordersBusiness,
}: {
  ordersBusiness: OrderProps[];
}) => {
  const [orders, setOrders] = useState<OrderProps[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const imageUrl = "http://localhost:5000/uploads/";

  useEffect(()=>{
    setOrders(ordersBusiness)
  }, [ordersBusiness]);

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleChangeStatus = async (orderId: number, status: string) => {
    if (!orderId || !status) {
      return;
    }
    const result = await HandleStatusOrder(orderId, status);
    if (result) {
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 3000);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <>
      <table className="table align-middle text-center mb-0">
        <thead className="bg-light rounded-4">
          <tr>
            <th>Order Id</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Total Amount</th>
            <th>Order Status</th>
            <th>Payment Status</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8}>Chưa có sản phẩm nào.</td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.user.username}</td>
                <td>0312312312321</td>
                <td>{order.total_amount} VNĐ</td>
                <td>{order.status}</td>
                <td>
                  <span
                    className={`badge ${
                      order.payment_status === "paid"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Xem Sản Phẩm
                  </button>
                  <div className="btn-group position-relative">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => toggleDropdown(index)}
                    >
                      Cập nhật trạng thái
                    </button>
                    {openDropdownIndex === index && (
                      <ul
                        className="dropdown-menu show position-absolute"
                        style={{ top: "100%", left: 0 }}
                      >
                        <li>
                          <button
                            onClick={() =>
                              handleChangeStatus(order.id, "approval")
                            }
                            className="dropdown-item"
                          >
                            Approval
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() =>
                              handleChangeStatus(order.id, "shipping")
                            }
                            className="dropdown-item"
                          >
                            Shipping
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedOrder && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content card shadow-lg rounded-4 border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Sản Phẩm Order #{selectedOrder.id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="d-flex flex-wrap gap-3 justify-content-start">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="card shadow-sm border-0"
                      style={{
                        flex: "1 1 250px",
                        minWidth: "200px",
                        maxWidth: "300px",
                      }}
                    >
                      <img
                        src={`${imageUrl}${item.product.image}`}
                        alt={item.product.productName}
                        className="card-img-top"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                      <div className="card-body">
                        <h6 className="card-title">
                          {item.product.productName}
                        </h6>
                        <p className="card-text text-truncate">
                          {item.product.description}
                        </p>
                        <p className="mb-1">Số lượng: {item.quantity}</p>
                        <p className="mb-0 fw-bold">
                          Giá: {item.price.toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <AlertSuccess message="Cập nhật trạng thái đơn hàng thành công!" />
      )}
      {error && <AlertError message="Cập nhật trạng thái đơn hàng thất bại!" />}
    </>
  );
};

export default ListOrderBusiness;
