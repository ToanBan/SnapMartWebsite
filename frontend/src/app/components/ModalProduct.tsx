import React from "react";
import { Package, X, Eye, ShoppingCart, TrendingUp } from "lucide-react";
import Image from "next/image";
const ModalProduct = ({
  user,
  onClose,
  imageUrl,
}: {
  user: any;
  onClose: any;
  imageUrl: string;
}) => {
  if (!user) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered shadow-lg">
        <div
          className="modal-content border-0"
          style={{ borderRadius: "1.25rem", overflow: "hidden" }}
        >
          <div className="modal-header border-bottom-0 py-3 px-4 bg-light d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center bg-primary rounded-3 shadow-sm"
                style={{ width: "40px", height: "40px" }}
              >
                <Package className="text-white" size={20} />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0 text-dark">
                  Danh sách sản phẩm đã mua
                </h5>
                <small className="text-muted">
                  Chi tiết các mặt hàng của {user.name}
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Nội dung chính: Bảng sản phẩm */}
          <div className="modal-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 border-0 text-secondary small fw-bold py-3">
                      SẢN PHẨM
                    </th>
                    <th className="border-0 text-secondary small fw-bold py-3 text-end">
                      GIÁ BÁN
                    </th>
                    <th className="border-0 text-secondary small fw-bold py-3 text-center">
                      SỐ LƯỢNG
                    </th>
                    <th className="border-0 text-secondary small fw-bold py-3 text-center">
                      SỐ LƯỢNG CÒN LẠI
                    </th>

                    <th className="border-0 text-secondary small fw-bold py-3 text-center">
                      TRẠNG THÁI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.products.map((product: any, index:string) => (
                    <tr key={index + 1} className="border-top">
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 border overflow-hidden shadow-sm"
                            style={{ width: "56px", height: "56px" }}
                          >
                            <Image
                              width={100}
                              height={100}
                              className="w-100 h-100 object-fit-cover"
                              src={`${imageUrl}${product.productImage}`}
                              alt={`${product.productName}`}
                            ></Image>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {product.name}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              ID: SM{product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark fw-medium px-2 py-1 border">
                          {product.productPrice}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-primary">
                        {product.quantity}
                      </td>
                      <td className="text-center">
                        <span className="badge rounded-pill bg-light text-dark border px-3">
                          {product.stock}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill px-2 py-1 ${
                            product.stock > 10
                              ? "bg-success-subtle text-success border border-success"
                              : product.stock < 10 && product.stock > 0
                              ? "bg-warning-subtle text-warning-emphasis border border-warning"
                              : "bg-danger-subtle text-danger border border-danger"
                          }`}
                          style={{ fontSize: "0.75rem" }}
                        >
                          ● {product.stock > 0 ? "Còn hàng" : "Hết Hàng"}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button className="btn btn-sm btn-light border-0 text-secondary p-2">
                            <Eye size={18} />
                          </button>
                          <button className="btn btn-sm btn-light border-0 text-secondary p-2">
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer của Modal */}
          <div className="modal-footer border-top-0 bg-light py-3 px-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <TrendingUp className="text-success" size={20} />
              </div>
              <div
                className="vr d-none d-md-block"
                style={{ height: "30px" }}
              ></div>
              <div className="d-none d-md-block">
                <small
                  className="text-muted d-block"
                  style={{ fontSize: "0.7rem", lineHeight: 1 }}
                >
                  MẶT HÀNG
                </small>
                <span className="fw-bold text-dark">
                  {user.products.length} sản phẩm
                </span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary border-secondary-subtle px-4 fw-semibold shadow-sm"
                onClick={onClose}
                style={{ borderRadius: "0.75rem" }}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary px-4 fw-semibold shadow-sm"
                style={{ borderRadius: "0.75rem" }}
              >
                Xuất hóa đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProduct;
