# SnapMartWebsite

- SnapMartWebsite là một dự án website cá nhân kết hợp giữa mạng xã hội và thương mại điện tử, cho phép người dùng vừa kết nối – chia sẻ nội dung, vừa mua bán sản phẩm trực tuyến.
- Dự án được xây dựng với mục tiêu:
  + Mô phỏng một hệ thống gần với sản phẩm thực tế
  + Áp dụng phân quyền nhiều vai trò
  + Triển khai realtime communication
  + Nghiên cứu và ứng dụng hệ gợi ý sản phẩm (Content-Based Filtering) sử dụng Redis Vector Search

---

## Công nghệ sử dụng

- Frontend
  + Next.js
  + Infinite Scroll

- Backend
  + Node.js – Express
  + JWT Authentication
  + OAuth 2.0 (Google Login)
  + Socket.IO (Realtime chat, gửi file)
  + Stripe Payment

- Recommendation System
  + Python (xử lý embedding)
  + Content-Based Filtering (CBF)
  + Redis Vector Search
  + Giao tiếp Python ↔ Node.js thông qua API

- Database & Others
  + MySQL
  + Redis (cache & vector database)
  + Chart.js (Dashboard)

## Các vai trò trong hệ thống
- User
Đăng ký tài khoản & xác thực email
Đăng nhập, quên mật khẩu, reset password (JWT)
Đăng nhập bằng Google
Cập nhật trang cá nhân (profile)
Theo dõi người dùng khác
→ 2 bên cùng follow sẽ trở thành bạn bè
Nhắn tin realtime với bạn bè (Socket.IO)
Gửi file realtime (ảnh, tài liệu)
Đăng bài viết (text, ảnh, video)
Bình luận, reaction, chia sẻ bài viết
Xem bảng tin:
Bài viết public
Bài viết của bạn bè
Infinite scroll khi tải dữ liệu
Tìm kiếm bạn bè và sản phẩm
Quản lý giỏ hàng (CRUD)
Thanh toán sản phẩm qua Stripe
Xem chi tiết doanh nghiệp & sản phẩm
Nhắn tin realtime với doanh nghiệp
Theo dõi đơn hàng
Đăng ký trở thành doanh nghiệp

- Business
Trang dashboard thống kê doanh thu (Chart.js)
Quản lý danh sách sản phẩm đã đăng tải
CRUD sản phẩm
Theo dõi đơn hàng của người dùng
Hiển thị danh sách sản phẩm chưa được mua
Xem lịch sử mua hàng của người dùng
Nhắn tin realtime với người dùng
Sử dụng pagination khi lấy dữ liệu

- Admin
Dashboard thống kê hệ thống (Chart.js)
Xác thực người dùng đăng ký trở thành business
Thay đổi vai trò người dùng
+ Quản lý danh sách:
  Người dùng
  Doanh nghiệp
  Bài viết
  Sản phẩm
Xác thực sản phẩm
Theo dõi đơn hàng
Ghi nhận và hiển thị log error
Phân quyền giữa các vai trò trong hệ thống

## Chức năng nổi bật: Gợi ý sản phẩm cá nhân hóa
Hệ thống gợi ý sản phẩm được xây dựng dựa trên Content-Based Filtering (CBF):
🔹 Quy trình hoạt động
Thu thập hành vi người dùng (xem sản phẩm, tìm kiếm sản phẩm, thêm sản phẩm, mua sản phẩm)
Gửi dữ liệu sang Python service để chuyển đổi thành embedding vector
Embedding được lưu vào Redis Vector Database
Khi người dùng truy cập, hệ thống:
So sánh vector người dùng với vector sản phẩm
Trả về danh sách sản phẩm phù hợp nhất
🔹 Công nghệ sử dụng
Python (xử lý embedding)
Redis Vector Search
API giao tiếp Python ↔ Node.js
👉 Giúp cá nhân hóa trải nghiệm mua sắm cho từng người dùng.