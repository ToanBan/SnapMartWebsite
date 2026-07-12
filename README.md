# SnapMartWebsite

SnapMartWebsite là một dự án website cá nhân kết hợp giữa **mạng xã hội** và **thương mại điện tử**, cho phép người dùng vừa kết nối – chia sẻ nội dung, vừa mua bán sản phẩm trực tuyến.

Dự án được xây dựng với mục tiêu:
- Mô phỏng một hệ thống gần với sản phẩm thực tế
- Áp dụng phân quyền nhiều vai trò (User, Business, Admin)
- Triển khai realtime communication (chat, thông báo)
- Nghiên cứu và ứng dụng hệ thống gợi ý sản phẩm cá nhân hóa (Content-Based Filtering) sử dụng Redis Vector Search và xử lý bất đồng bộ qua RabbitMQ

---

## Công nghệ sử dụng

### Frontend
- **Next.js** (App Router)


### Backend
- **Node.js – Express**
- **JWT Authentication** + **OAuth 2.0** (Google Login)
- **Socket.IO** (Realtime chat, gửi file, thông báo)
- **Stripe Payment**
- **node-cron** (Tự động hóa tác vụ nền)

### Recommendation System
- **Python** + `intfloat/multilingual-e5-base` (Sentence Transformers)
- **Content-Based Filtering (CBF)** với trọng số hành vi người dùng
- **Redis Vector Search** (RediSearch, KNN – K-Nearest Neighbors)
- **RabbitMQ** (Message Queue – xử lý bất đồng bộ)
- **Node.js Consumer Worker** (Background Job với prefetch=1 và retry 3 lần)

### Database & Others
- **MySQL** (Sequelize ORM)
- **Redis Stack** (Cache + Vector Database)
- **RabbitMQ** (Message Broker)
- **Chart.js** (Dashboard thống kê)
- **Docker Compose** (MySQL, Redis Stack, RabbitMQ)

---

## Các vai trò trong hệ thống

### User
- Đăng ký tài khoản & xác thực email
- Đăng nhập, quên mật khẩu, reset password (JWT)
- Đăng nhập bằng Google (OAuth 2.0)
- Cập nhật trang cá nhân (profile)
- Theo dõi người dùng khác (2 bên follow = kết bạn)
- Nhắn tin realtime với bạn bè và doanh nghiệp (Socket.IO)
- Gửi file realtime (ảnh, tài liệu)
- Đăng bài viết (text, ảnh, video) với tùy chỉnh quyền riêng tư
- Bình luận, reaction, chia sẻ bài viết
- Xem bảng tin: bài viết public / bài viết của bạn bè 
- Tìm kiếm bạn bè và sản phẩm
- Nhận gợi ý sản phẩm cá nhân hóa dựa trên hành vi
- Quản lý giỏ hàng (CRUD)
- Thanh toán qua Stripe (Online) và COD
- Xem chi tiết doanh nghiệp & sản phẩm
- Theo dõi đơn hàng
- Đăng ký trở thành doanh nghiệp

### Business
- Dashboard thống kê doanh thu (Chart.js)
- CRUD sản phẩm
- Quản lý và cập nhật trạng thái đơn hàng
- Hiển thị danh sách sản phẩm chưa được mua
- Nhắn tin realtime với người dùng
- Pagination khi tải dữ liệu

### Admin
- Dashboard thống kê hệ thống (Chart.js)
- Xác thực doanh nghiệp đăng ký mới
- Xác thực sản phẩm trước khi hiển thị
- Thay đổi vai trò người dùng
- Quản lý danh sách: Người dùng, Doanh nghiệp, Bài viết, Sản phẩm, Đơn hàng
- Ghi nhận và hiển thị log error hệ thống

---

## Chức năng nổi bật: Gợi ý sản phẩm cá nhân hóa

Hệ thống gợi ý được xây dựng theo mô hình **Content-Based Filtering (CBF)** kết hợp với kiến trúc **Asynchronous Queue** để đảm bảo hiệu năng và khả năng mở rộng.

### Quy trình hoạt động

**Offline (Cronjob – 2:00 sáng mỗi ngày):**
1. `EmbeddingSchedule` kiểm tra DB và Redis → chỉ lấy sản phẩm **chưa có vector** (Incremental Indexing).
2. Chạy `generate_embeddings.py` → encode tên & mô tả sản phẩm thành vector 768 chiều.
3. Chạy `generate_redisvector.py` → lưu vector vào Redis dưới dạng Hash (`product:<id>`).
4. `redisSetup.js` tạo Index `idx_products` (RediSearch) để tra cứu KNN siêu nhanh.

**Online (Real-time – khi người dùng tương tác):**
1. Người dùng thực hiện hành động (xem, tìm kiếm, thêm giỏ hàng, mua hàng).
2. Frontend gọi API `POST /api/send-action` → Node.js **publish** message vào RabbitMQ queue `user_actions` và trả về HTTP 200 ngay lập tức (non-blocking).
3. **Consumer Worker** (`consumer/worker.js`) lắng nghe queue với `prefetch=1`:
   - Tính toán văn bản ngữ cảnh `finalText` theo trọng số hành vi (view:1, search:2, add-cart:4, buy:6).
   - Gọi `encode_query.py` → sinh vector 768 chiều cho user.
   - Thực thi `FT.SEARCH idx_products KNN 5` trên Redis → tìm 5 sản phẩm có vector gần nhất.
   - Lưu kết quả vào Redis: `recommend:user:<userId>` (Cache 1 ngày).
4. Frontend gọi `GET /api/recommendations` → Node.js đọc Redis → trả về danh sách sản phẩm chi tiết ngay lập tức.

### Điểm nổi bật về kiến trúc
- **RabbitMQ làm Buffer:** Server không bao giờ bị sập dù có hàng nghìn request đồng thời, vì tác vụ AI được đưa vào hàng đợi xử lý tuần tự.
- **Retry tối đa 3 lần:** Tác vụ thất bại được tự động thử lại 3 lần trước khi loại bỏ.
- **Incremental Indexing:** Cronjob chỉ xử lý sản phẩm mới, không tốn tài nguyên cho sản phẩm đã được index.
- **Semantic Search:** Model `multilingual-e5-base` hiểu ngữ nghĩa đa ngôn ngữ, không phụ thuộc từ khóa cứng.
