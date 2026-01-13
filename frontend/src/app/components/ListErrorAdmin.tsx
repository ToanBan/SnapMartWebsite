import React from "react";
import dayjs from "dayjs";

interface Error {
  id: string;
  message: string;
  url: string;
  method: string;
  statusCode: string;
  createdAt: string;
}

interface ErrorProps {
  data: Error[];
  countErrors: string;
}

const ListErrorAdmin = ({ errors }: { errors: ErrorProps }) => {
  return (
    <>
      <div className="dashboard-container">
        <div className="header-section">
          <div>
            <h1>
              <i data-lucide="shield-alert" style={{ color: "#ef4444;" }}></i>{" "}
              Nhật Ký Lỗi Hệ Thống
            </h1>
            <p className="text-muted mb-0">
              Theo dõi và quản lý các lỗi phát sinh trong thời gian thực
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
              <i data-lucide="download" aria-setsize={16}></i> Xuất CSV
            </button>
            <button className="btn btn-danger btn-sm d-flex align-items-center gap-1">
              <i data-lucide="trash-2" aria-setsize={16}></i> Xóa Tất Cả
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card p-3">
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Tổng lỗi</span>
                <i
                  data-lucide="activity"
                  className="text-primary"
                  aria-setsize={18}
                ></i>
              </div>
              <h3 className="mb-0 mt-2">{errors.countErrors}</h3>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th style={{ width: "18px" }}>ID</th>
                  <th>Thông điệp & Stack</th>
                  <th>Endpoint (URL)</th>
                  <th>Trạng thái</th>
                  <th>Thời gian tạo</th>
                </tr>
              </thead>
              <tbody>
                {errors.data.length > 0 ? (
                  errors.data.map((error, index) => (
                    <tr key={index}>
                      <td>
                        <span className="text-muted fw-bold">#{error.id}</span>
                      </td>
                      <td>
                        <div className="error-message">
                          {error.message}
                        </div>
                    
                      </td>
                      <td>
                        <span className="method-tag method-get">{error.method}</span>
                        <a href="#" className="url-text">
                          {error.url}
                        </a>
                      </td>
                      <td>
                        <span className="badge-status status-5xx">
                          {error.statusCode}
                        </span>
                      </td>
                      <td>
                        <div className="timestamp">
                          {dayjs(error.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }

        .header-section {
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-section h1 {
            font-weight: 700;
            font-size: 1.5rem;
            margin-bottom: 0.25rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card {
            border: none;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            background-color: var(--card-bg);
            overflow: hidden;
        }

        .table-responsive {
            border-radius: 16px;
        }

        .table {
            margin-bottom: 0;
            vertical-align: middle;
        }

        .table thead th {
            background-color: #f1f5f9;
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }

        .table tbody td {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.875rem;
        }

        .table tbody tr:hover {
            background-color: #f8fafc;
            transition: background-color 0.2s ease;
        }

        /* Status Badges */
        .badge-status {
            padding: 0.4em 0.8em;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.75rem;
        }
        .status-2xx { background-color: #dcfce7; color: #15803d; }
        .status-4xx { background-color: #fef9c3; color: #a16207; }
        .status-5xx { background-color: #fee2e2; color: #b91c1c; }

        /* Method Tags */
        .method-tag {
            font-weight: 700;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            margin-right: 4px;
        }
        .method-get { color: #0ea5e9; background: #e0f2fe; }
        .method-post { color: #10b981; background: #d1fae5; }
        .method-put { color: #f59e0b; background: #fef3c7; }
        .method-delete { color: #ef4444; background: #fee2e2; }

        .error-message {
            font-weight: 500;
            color: #ef4444;
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .stack-trace {
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.75rem;
            color: var(--text-muted);
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background: #f1f5f9;
            padding: 2px 4px;
            border-radius: 4px;
        }

        .url-text {
            color: var(--accent-color);
            text-decoration: none;
            font-size: 0.8rem;
        }

        .timestamp {
            color: var(--text-muted);
            font-size: 0.8rem;
        }

        /* Action Buttons */
        .btn-action {
            padding: 5px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            background: white;
            color: var(--text-muted);
            transition: all 0.2s;
        }
        .btn-action:hover {
            background: var(--accent-color);
            color: white;
            border-color: var(--accent-color);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default ListErrorAdmin;
