import React from "react";
import {
  Box,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Archive,
  Calendar,
  AlertTriangle,
  FileText,
  CalendarDays,
} from "lucide-react";
import RevenueChart from "./share/RevenueChart";
const Dashboard = ({ data, isAdmin }: { data: any; isAdmin?: boolean }) => {
  console.log(isAdmin);
  console.log(data);
  return (
    <>
      <div
        className="container-xl py-5"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        <div className="dashboard-header d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="dashboard-title">Hệ Thống Quản Trị</h2>
            <p className="text-muted mb-0">Chào mừng trở lại</p>
          </div>
          <div className="text-end">
            <span className="badge bg-white text-dark shadow-sm p-2 px-3 rounded-pill border d-inline-flex align-items-center">
              <Calendar size={16} className="me-2 text-primary" />
              Tháng 1, 2026
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-4">
          <div className="col-12">
            <div className="stat-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">📈 Doanh thu theo tháng</h5>
                  <span className="badge bg-light text-dark">
                    12 tháng gần nhất
                  </span>
                </div>

                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "30rem" }}
                >
                  <RevenueChart data={data.monthlyAllRevenue} />
                </div>
              </div>
            </div>
          </div>

          {/* 1. Tổng sản phẩm */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="card-body">
                <div className="icon-box bg-products">
                  <Box size={24} color="white" strokeWidth={2.5} />
                </div>
                <div className="stat-value">{data.countProduct}</div>
                <div className="stat-label">Tổng sản phẩm</div>
                <div className="mt-3">
                  <span className="trend-badge trend-up">
                    +12% so với tháng trước
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Sản phẩm đã mua */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="card-body">
                <div className="icon-box bg-sold">
                  <ShoppingCart size={24} color="white" strokeWidth={2.5} />
                </div>
                <div className="stat-value">{data.countOrder}</div>
                <div className="stat-label">Số lượng sản phẩm đã mua</div>
                <div className="mt-3">
                  <span className="trend-badge trend-up">Tốc độ bán tốt</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Khách hàng */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="card-body">
                <div className="icon-box bg-customers">
                  <Users size={24} color="white" strokeWidth={2.5} />
                </div>
                <div className="stat-value">{data.countBuyer}</div>
                <div className="stat-label">Khách hàng đã mua</div>
                <div className="mt-3">
                  <span className="trend-badge trend-up">
                    85% khách quay lại
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Tổng doanh số */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="stat-card shadow-lg border-primary border-top border-4">
              <div className="card-body">
                <div className="icon-box bg-total-sales">
                  <DollarSign size={24} color="white" strokeWidth={2.5} />
                </div>
                <div className="stat-value text-primary">
                  ${Number(data.totalRevenue).toLocaleString("vi-VN")}
                </div>
                <div className="stat-label">Tổng doanh số</div>
                <div className="mt-3">
                  <small className="text-muted">Tính từ khi bắt đầu</small>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Doanh số tháng */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="stat-card border-start border-5 border-dark">
              <div className="card-body">
                <div className="icon-box bg-monthly-sales">
                  <TrendingUp size={24} color="white" strokeWidth={2.5} />
                </div>
                <div className="stat-value">
                  ${Number(data.monthlyRevenue).toLocaleString("vi-VN")}
                </div>
                <div className="stat-label">Doanh số tháng hiện tại</div>
                <div className="mt-3 d-flex align-items-center">
                  <div
                    className="progress w-100"
                    style={{ height: "8px", borderRadius: "10px" }}
                  >
                    <div
                      className="progress-bar bg-dark"
                      role="progressbar"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <span className="ms-2 fw-bold">65%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Trạng thái đơn hàng */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="stat-card">
              <div className="card-body">
                <div className="icon-box bg-pending">
                  <Clock size={24} color="white" strokeWidth={2.5} />
                </div>
                <div className="stat-value text-warning">
                  {data.countOrderNotDelivered}
                </div>
                <div className="stat-label">Đang xử lý / Chờ giao</div>
                <p className="mt-3 mb-0 small text-muted">
                  Bao gồm: Chờ xác nhận, Đang giao, Đã hủy
                </p>
              </div>
            </div>
          </div>

          {/* 7. Tồn kho */}
          <div className="col-12 col-md-12 col-lg-4">
            <div className="stat-card">
              <div className="card-body">
                <div className="icon-box bg-unsold">
                  <Archive size={24} color="white" strokeWidth={2.5} />
                </div>
                <div className="stat-value text-danger">
                  {data.unsoldProductCount}
                </div>
                <div className="stat-label">Sản phẩm chưa được mua</div>
                <div className="mt-3">
                  <div
                    className="alert alert-danger py-1 px-3 mb-0 border-0 d-flex align-items-center"
                    style={{ fontSize: "0.8rem", borderRadius: "10px" }}
                  >
                    <AlertTriangle size={14} className="me-2" />
                    Cần đẩy mạnh khuyến mãi
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 8. Admin */}
          {isAdmin && (
            <>
              <div className="col-12 col-md-12 col-lg-4">
                <div className="stat-card">
                  <div className="card-body">
                    <div className="icon-box bg-products">
                      <FileText size={24} color="white" strokeWidth={2.5} />
                    </div>
                    <div className="stat-value text-danger">
                      {data.countAllPosts}
                    </div>
                    <div className="stat-label">Tổng Số Lượng Bài Viết</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-12 col-lg-4">
                <div className="stat-card">
                  <div className="card-body">
                    <div className="icon-box bg-customers">
                      <Users size={24} color="white" strokeWidth={2.5} />
                    </div>
                    <div className="stat-value text-danger">{data.countAllUsers}</div>
                    <div className="stat-label">Người Dùng</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-12 col-lg-4">
                <div className="stat-card">
                  <div className="card-body">
                    <div className="icon-box bg-unsold">
                      <CalendarDays size={24} color="white" strokeWidth={2.5} />
                    </div>
                    <div className="stat-value text-danger">{data.todayPosts}</div>
                    <div className="stat-label">Số Lượng Bài Viết Hôm Nay</div>
                    <div className="mt-3"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --secondary-gradient: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            --info-gradient: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
            --warning-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --danger-gradient: linear-gradient(135deg, #ff0844 0%, #ffb199 100%);
            --dark-gradient: linear-gradient(135deg, #232526 0%, #414345 100%);
            --card-shadow: 0 10px 20px rgba(0,0,0,0.05);
            --transition: all 0.3s ease;
        }

        .dashboard-title {
            font-weight: 700;
            color: #1e293b;
            letter-spacing: -0.5px;
        }

        .stat-card {
            border: none;
            border-radius: 16px;
            overflow: hidden;
            transition: var(--transition);
            background: #fff;
            box-shadow: var(--card-shadow);
            height: 100%;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .card-body {
            padding: 1.5rem;
        }

        .icon-box {
            width: 54px;
            height: 54px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.25rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            color: #1e293b;
        }

        .stat-label {
            font-size: 0.825rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .bg-products { background: var(--primary-gradient); }
        .bg-sold { background: var(--success-gradient); }
        .bg-customers { background: var(--info-gradient); }
        .bg-total-sales { background: var(--secondary-gradient); }
        .bg-monthly-sales { background: var(--dark-gradient); }
        .bg-pending { background: var(--warning-gradient); }
        .bg-unsold { background: var(--danger-gradient); }

        .trend-badge {
            font-size: 0.75rem;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 600;
            display: inline-block;
        }
        
        .trend-up { background: rgba(56, 239, 125, 0.1); color: #0b8d44; }

        @media (max-width: 768px) {
            .stat-value { font-size: 1.5rem; }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
