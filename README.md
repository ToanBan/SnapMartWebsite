# SnapMartWebsite

SnapMartWebsite là một nền tảng Social Commerce kết hợp giữa mạng xã hội và thương mại điện tử.  
Người dùng có thể đăng bài, tương tác, chat realtime và mua sắm sản phẩm; trong khi các business có thể bán hàng sau khi được admin xác thực.  
Hệ thống có sử dụng Redis cache và Redis Vector để gợi ý sản phẩm.

---

## Tính năng chính

### 👤 Người dùng (User)
- Đăng ký / đăng nhập bằng JWT
- Đăng nhập bằng Google OAuth
- Quên mật khẩu, đổi mật khẩu
- Tạo bài đăng (text, hình ảnh, video, file)
- Follow người dùng khác, nếu follow 2 chiều sẽ trở thành bạn bè
- Xem bài đăng:
  - Public feed (ai cũng xem được, có infinite scroll)
  - Friends feed (chỉ bạn bè, có infinite scroll)
- Reaction, comment, share bài viết
- Chat realtime với bạn bè (text & file)
- Tìm kiếm sản phẩm
- Mua sản phẩm
- Theo dõi đơn hàng
- Chat realtime với các business bán sản phẩm
- Gợi ý sản phẩm cá nhân hóa bằng CBF (Content Based Filtering)
- Thanh toán sản phẩm bằng Stripe
- Tích hợp Stripe Checkout và Stripe Webhook để xử lý và xác thực thanh toán an toàn


---

### Người bán (Business)
- Đăng ký trở thành business (cần admin xét duyệt)
- CRUD sản phẩm
- Sản phẩm cần được admin duyệt trước khi hiển thị
- Chat realtime với người dùng mua sản phẩm
- Xem danh sách người dùng đã mua hàng
- Thống kê và quản lý hoạt động bán hàng
- Tracking đơn hàng 
- Sử dụng pagination khi hiển thị danh sách lớn để tối ưu hiệu năng
---

### Quản trị viên (Admin)
- Xét duyệt đăng ký business
- Xét duyệt sản phẩm (pending / approved / rejected)
- Quản lý người dùng, business, bài đăng, sản phẩm
- Thống kê toàn bộ hệ thống
- Sử dụng pagination khi hiển thị danh sách lớn để tối ưu hiệu năng

---

## Gợi ý & Tối ưu hiệu năng

- Sử dụng Redis cache để cache dữ liệu sản phẩm khi hiển thị cho người dùng
- Áp dụng Redis Vector similarity để xây dựng hệ thống gợi ý sản phẩm dựa trên hành vi người dùng
- Infinite scroll cho feed bạn bè
- Pagination cho các trang quản trị và danh sách lớn

---

## Công nghệ sử dụng

- Frontend: Next.js
- Backend: Express.js
- Authentication: JWT, Google OAuth
- Realtime: Socket.IO
- Cache & Recommendation: Redis, Redis Vector
- Database: MySQL
- Payment: Stripe (Checkout & Webhook)
- File upload: Local

---

## Kiến trúc tổng quan

- Frontend giao tiếp với backend qua REST API
- Authentication & phân quyền theo role: User / Business / Admin
- Realtime chat sử dụng Socket.IO
- Redis dùng cho cache dữ liệu và tìm kiếm vector
- Admin quản lý và kiểm duyệt nội dung trước khi hiển thị

