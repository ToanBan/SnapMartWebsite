"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  UserRound,
  Briefcase,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
  UserCheck,
  UserX,
} from "lucide-react";
import ChangeStatusUsers from "../api/admin/ChangeStatusUsers";
import Swal from "sweetalert2";
interface UserProps {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

const ListAllUsersAdmin = ({ usersData }: { usersData: UserProps[] }) => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUsers(usersData);
  }, [usersData]);

  const handleChooseUser = (user: any) => {
    if (!user) return;
    console.log(user);
    setShowModal(true);
    setSelectedUser(user);
  };

  const handleChangeStatus = async (userId: string, status: string) => {
    if (!userId || !status) return;
    const result = await ChangeStatusUsers(userId, status);
    if (result.success && result.data) {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật trạng thái người dùng thành công",
        timer: 1500,
      });

      console.log(result.data);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === result.data.id
            ? { ...user, status: result.data.status }
            : user
        )
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: result.message || "Cập nhật trạng thái thất bại",
      });
    }
  };

  return (
    <div className="" style={{ width: "100%" }}>
      <div className="container">
        <div className="header-section d-flex justify-content-between align-items-center bg-white p-4 rounded-top-4 border-bottom">
          <div>
            <h2 className="fw-bold mb-1">Users List</h2>
            <p className="text-muted mb-0">
              Manage your application users and their roles.
            </p>
          </div>
        </div>

        <div className="table-container bg-white shadow-sm overflow-hidden border border-light-subtle rounded-bottom-4">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr className="bg-light">
                  <th className="px-4 py-3 text-muted fw-semibold text-uppercase small">
                    ID
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold text-uppercase small">
                    User Info
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold text-uppercase small">
                    Role
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold text-uppercase small text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="user-row">
                    <td className="px-4 py-3">
                      <span className="user-id text-muted font-monospace small">
                        #USR-{user.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <User size={20} color="#4f46e5" />
                        </div>
                        <div>
                          <div className="username fw-semibold text-dark">
                            {user.username}
                          </div>
                          <div className="email text-muted small">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`role-badge ${
                          user.role === "User" ? "badge-user" : "badge-business"
                        }`}
                      >
                        {user.role === "user" ? (
                          <UserRound size={14} />
                        ) : (
                          <Briefcase size={14} />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        onClick={() => handleChooseUser(user)}
                        className="btn-edit-role border rounded-2 px-3 py-1 fw-medium small bg-white d-inline-flex align-items-center gap-2"
                      >
                        <ShieldCheck size={16} /> CHANGE STATUS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-custom-overlay">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 p-2 bg-white">
              <div className="modal-header border-0 d-flex justify-content-between align-items-center p-3">
                <h5 className="modal-title fw-bold m-0">Update Role</h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-3">
                <p className="text-muted mb-4 small">
                  Choose a new status for{" "}
                  <strong>{selectedUser?.username}</strong>. This will change
                  their permissions immediately.
                </p>

                <div
                  className={`role-option d-flex align-items-center p-3 mb-2 rounded-3 border-2 ${
                    selectedUser?.status === "active"
                      ? "active-role border-primary-subtle bg-primary-subtle"
                      : "border-light-subtle"
                  }`}
                  onClick={() =>
                    selectedUser &&
                    handleChangeStatus(selectedUser.id, "active")
                  }
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div className="me-3 bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                    <UserCheck size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small">Active</div>
                  </div>
                  {selectedUser?.status === "active" && (
                    <UserCheck size={20} className="text-primary" />
                  )}
                </div>

                <div
                  className={`role-option d-flex align-items-center p-3 rounded-3 border-2 ${
                    selectedUser?.status === "blocked"
                      ? "active-role border-warning-subtle bg-warning-subtle"
                      : "border-light-subtle"
                  }`}
                  onClick={() =>
                    selectedUser &&
                    handleChangeStatus(selectedUser.id, "blocked")
                  }
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div className="me-3 bg-warning bg-opacity-10 p-2 rounded-3 text-warning">
                    <UserX size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small">Block</div>
                  </div>
                  {selectedUser?.status === "blocked" && (
                    <UserX size={20} className="text-warning" />
                  )}
                </div>
              </div>
              <div className="modal-footer border-0 p-3 gap-2">
                <button
                  className="btn btn-light px-4 rounded-3 border"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary px-4 rounded-3"
                  style={{ backgroundColor: "#4f46e5" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .header-section { border-radius: 16px 16px 0 0; }
        .table-container { border-radius: 0 0 16px 16px; }
        
        .user-row:hover { background-color: #f8fafc; }
        
        .role-badge {
          padding: 0.4em 0.8em;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .badge-user { background-color: #e0f2fe; color: #0369a1; }
        .badge-business { background-color: #fef3c7; color: #92400e; }

        .btn-edit-role { color: #1e293b; transition: all 0.2s; }
        .btn-edit-role:hover { color: #4f46e5; border-color: #4f46e5; background: #f5f3ff; }

        .modal-custom-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1050;
        }

        .active-role { border-color: #4f46e5 !important; }
        .extra-small { font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default ListAllUsersAdmin;
