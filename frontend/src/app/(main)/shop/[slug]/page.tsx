import React from "react";
import { MessageCircle } from "lucide-react";
import GetSeekShop from "@/app/api/users/GetSeekShop";
import Image from "next/image";
import ChatBusiness from "@/app/components/ChatBusiness";
import ListProductByBusiness from "@/app/components/ListProductByBusiness";
import GetProductsByBusiness from "@/app/api/business/GetProductsByBusiness";
const ShopOfBusiness = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) => {
  const { slug } = await params;
  const data = await GetSeekShop(slug);
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;
  const page = Number(searchParams.page) || 1;

  const products = await GetProductsByBusiness(slug, page);

  return (
    <>
      <section className="hero-section" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 mb-3 rounded-pill">
                Chào mừng đến với {data.businessName}
              </span>
              <h1 className="display-4 fw-bold mb-4 text-dark">
                {data.description}
              </h1>
              <p className="lead text-muted mb-4">
                Doanh nghiệp của chúng tôi được đặt tại {data.address}
              </p>
              <div className="d-flex gap-3">
                <a href="#products" className="btn btn-primary btn-lg">
                  Khám phá ngay
                </a>
                <button className="btn btn-outline-dark btn-lg">
                  Tư vấn miễn phí
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                className="img-fluid hero-image"
                alt={`${data.businessName}`}
                src={`${imageUrl}${data.verificationDocument}`}
              />
            </div>
          </div>
        </div>
      </section>

      <ListProductByBusiness products={products} shopId={slug} page={page} />

      <ChatBusiness businessId={slug} />

      <style>{`
        /* Hero Section */
        .hero-section {
            padding: 120px 0 80px;
            background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
            border-bottom-left-radius: 50px;
            border-bottom-right-radius: 50px;
        }

        .hero-image {
            border-radius: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }

        .hero-image:hover {
            transform: translateY(-10px);
        }

        /* Product Cards */
        .product-card {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            background: #fff;
            transition: all 0.3s ease;
            height: 100%;
        }

        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.08);
        }

        .product-img-wrapper {
            position: relative;
            overflow: hidden;
            aspect-ratio: 1/1;
        }

        .product-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .product-card:hover .product-img-wrapper img {
            transform: scale(1.1);
        }

        .btn-primary {
            background-color: var(--primary-color);
            border: none;
            padding: 10px 25px;
            border-radius: 12px;
            font-weight: 600;
        }

        
      `}</style>
    </>
  );
};

export default ShopOfBusiness;
