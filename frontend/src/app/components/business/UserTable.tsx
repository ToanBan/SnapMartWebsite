"use client";
import React, { useState } from "react";
import ModalProduct from "../ModalProduct";
import Image from "next/image";
interface ProductProps {
  id: string;
  quantity: string;
  price: string;

  productName: string;
  image: string;
}

interface DataProps {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  products: ProductProps[]
}

const UserTable = ({ data }: { data: DataProps[] }) => {
  const [selectedUser, setSelectedUser] = useState<DataProps | null>(null);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;

  return (
    <>
      <div className="container-xl py-5">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Quản lý Khách hàng</h2>
          
        </div>

        <div className="glass-card">
          <div className="card-header-custom">
            <div
              className="input-group input-group-sm"
              style={{ width: "250px" }}
            >
              <span className="input-group-text bg-white border-end-0">
                <i data-lucide="search" aria-setsize={16}></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Tìm kiếm..."
              />
            </div>
            <button
              className="btn btn-primary btn-sm px-3 rounded-3"
              style={{
                backgroundColor: "var(--primary-color)",
                border: "none",
              }}
            >
              + Thêm User
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item: DataProps) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar">{item.id}</div>
                          <span className="fw-semibold">{item.username}</span>
                        </div>
                      </td>
                      <td className="text-secondary">{item.email}</td>
                      <td className="text-secondary">{item.role}</td>

                      <td className="text-end">
                        <button
                          className="btn btn-history"
                          onClick={() => setSelectedUser(item)}
                        >
                          <i data-lucide="shopping-bag" aria-setsize={14}></i>{" "}
                          Lịch sử
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p></p>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedUser && (
        <ModalProduct
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          imageUrl={imageUrl}
        />
      )}
      <style>{`

        .container-custom {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 15px;
        }

        .glass-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .card-header-custom {
            padding: 1.5rem;
            background: #fff;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table thead th {
            background-color: #f8fafc;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            padding: 1rem 1.5rem;
            border-top: none;
        }

        .table tbody td {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.9rem;
            vertical-align: middle;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: var(--primary-color);
            margin-right: 12px;
        }

        .badge-status {
            padding: 0.35em 0.65em;
            font-size: 0.75rem;
            border-radius: 6px;
            font-weight: 500;
        }

        .status-active { background-color: #dcfce7; color: #166534; }
        .status-pending { background-color: #fef9c3; color: #854d0e; }
        .status-locked { background-color: #fee2e2; color: #991b1b; }

        .btn-history {
            background-color: #fff;
            border: 1px solid #e2e8f0;
            color: var(--text-main);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            text-decoration: none;
        }

        .btn-history:hover {
            background-color: var(--primary-color);
            color: #fff;
            border-color: var(--primary-color);
        }`}</style>
    </>
  );
};

export default UserTable;
