import React from "react";
import dayjs from "dayjs";

interface ProductProps {
  id: string;
  productName: string;
  price: string;
  createdAt: string;
}

const ListNonProductBusiness = ({data}:{data:ProductProps[]}) => {
  return (
    <>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Mã Sản Phẩm</th>
              <th>Tên Sản Phẩm</th>
              <th>Giá Sản Phẩm</th>
              <th>Ngày Đăng</th>
              <th className="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar">{product.id}</div>
                      <span className="fw-semibold">#SM - {product.id}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{product.productName}</td>
                  <td className="text-secondary">{product.price}</td>
                  <td className="text-secondary">
                    {dayjs(product.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-history"
                      data-bs-toggle="modal"
                      data-bs-target="#modalUser1"
                    >
                      <i data-lucide="shopping-bag" aria-setsize={14}></i>
                      Sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListNonProductBusiness;
