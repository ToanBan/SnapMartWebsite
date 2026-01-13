import React from "react";
import {
  Video,
  ShoppingBag,
  Users,
  Target,
  Eye,
  Lightbulb,
  Handshake,
  Rocket,
  Scale
} from "lucide-react";

const AboutPage = () => {
  return (
    <>
      <section className="hero-section text-center" id="about" style={{ marginTop: "6rem" }}>
        <div className="container px-4">
          <h1>Chào mừng bạn đến với SnapMart</h1>
          <p>
            Nơi sự sáng tạo không giới hạn gặp gỡ thế giới mua sắm tiện ích.
            Chúng tôi mang đến một nền tảng độc đáo, kết hợp giải trí và thương
            mại điện tử.
          </p>
          <a href="#" className="btn-custom text-decoration-none">
            Khám phá ngay!
          </a>
        </div>
      </section>

      <section className="py-5">
        <div className="container px-4">
          <h2 className="text-center section-title mb-5">Chúng tôi là ai và làm gì?</h2>

          <div className="row g-5 justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 d-flex flex-column align-items-center text-center">
                <div className="icon-circle">
                  <Video size={32} />
                </div>
                <h3 className="fs-4 fw-semibold mb-3">Nền tảng video ngắn độc đáo</h3>
                <p className="text-secondary">
                  Thể hiện cá tính, chia sẻ câu chuyện và kết nối với cộng đồng
                  hàng triệu người dùng thông qua những video ngắn đầy sáng tạo.
                  TrendMart cung cấp các công cụ chỉnh sửa, hiệu ứng và thư viện
                  âm nhạc đa dạng để bạn thỏa sức sáng tạo.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 d-flex flex-column align-items-center text-center">
                <div className="icon-circle">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="fs-4 fw-semibold mb-3">Trải nghiệm mua sắm thông minh</h3>
                <p className="text-secondary">
                  Biến cảm hứng xem video thành hành động mua sắm! Khám phá và
                  mua sắm các sản phẩm yêu thích trực tiếp từ video hoặc qua các
                  cửa hàng tích hợp. Chúng tôi đảm bảo các sản phẩm chất lượng
                  và giao dịch an toàn.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 p-4 d-flex flex-column align-items-center text-center">
                <div className="icon-circle">
                  <Users size={32} />
                </div>
                <h3 className="fs-4 fw-semibold mb-3">Cộng đồng sôi động & Kết nối</h3>
                <p className="text-secondary">
                  Gia nhập một cộng đồng năng động, nơi bạn có thể tương tác với
                  những nhà sáng tạo, khám phá xu hướng mới và xây dựng mạng
                  lưới của riêng mình. Cùng nhau tạo nên những trải nghiệm đáng
                  nhớ!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 mission-vision-section">
        <div className="container px-4">
          <h2 className="text-center fw-bold mb-5">Sứ mệnh và Tầm nhìn của chúng tôi</h2>
          <div className="row g-5 justify-content-center">
            <div className="col-md-6">
              <div className="card p-4 d-flex justify-content-center align-items-center">
                <div className="icon-circle">
                  <Target size={32} />
                </div>
                <h3 className="mb-3 align-baseline">Sứ mệnh</h3>
                <p className="text-center">
                  Nâng cao trải nghiệm người dùng bằng cách kết hợp giải trí và
                  mua sắm một cách liền mạch, tạo ra một không gian nơi mọi
                  người có thể khám phá, sáng tạo và kết nối một cách ý nghĩa.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-4 d-flex justify-content-center align-items-center">
                <div className="icon-circle">
                  <Eye size={32} />
                </div>
                <h3 className="mb-3">Tầm nhìn</h3>
                <p className="text-center">
                  Trở thành nền tảng hàng đầu thế giới, định hình tương lai của
                  việc tiêu thụ nội dung và mua sắm trực tuyến bằng cách liên
                  tục đổi mới và đặt người dùng làm trung tâm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container px-4">
          <h2 className="text-center section-title mb-5">Giá trị cốt lõi</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 p-4 text-center">
                <div className="icon-circle mx-auto">
                  <Lightbulb size={32} />
                </div>
                <h4 className="fs-5 fw-semibold mb-2">Sáng tạo</h4>
                <p className="text-secondary">
                  Luôn khuyến khích và tôn vinh sự độc đáo, khác biệt trong mọi
                  nội dung.
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 p-4 text-center">
                <div className="icon-circle mx-auto">
                  <Handshake size={32} />
                </div>
                <h4 className="fs-5 fw-semibold mb-2">Cộng đồng</h4>
                <p className="text-secondary">
                  Xây dựng một không gian an toàn, tôn trọng và hỗ trợ lẫn nhau.
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 p-4 text-center">
                <div className="icon-circle mx-auto">
                  <Rocket size={32} />
                </div>
                <h4 className="fs-5 fw-semibold mb-2">Đổi mới</h4>
                <p className="text-secondary">
                  Không ngừng phát triển và cải thiện để mang lại trải nghiệm
                  tốt nhất.
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 p-4 text-center">
                <div className="icon-circle mx-auto">
                  <Scale size={32} />
                </div>
                <h4 className="fs-5 fw-semibold mb-2">Liêm chính</h4>
                <p className="text-secondary">
                  Đảm bảo sự minh bạch và công bằng trong mọi hoạt động giao
                  dịch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
