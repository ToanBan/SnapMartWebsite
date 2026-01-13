import React from "react";
import ListProduct from "@/app/components/ListProduct";
import GetProductApproved from "@/app/api/admin/GetProductApproved";
import Chatbot from "@/app/components/Chatbot";
import SearchProducts from "@/app/components/SearchProducts";
import PaginationProduct from "@/app/components/PaginationProduct";
import TrackSendActionView from "@/app/components/TrackSendActionView";
import ListSuggestionProducts from "@/app/components/ListSuggestionProducts";
const ShopePage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;

  return (
    <>
      <TrackSendActionView />

      <div style={{ marginTop: "12rem" }}>
        <div className="container">
          <SearchProducts />
          <div className="mb-5 text-center">
            <h2 className="fw-bold display-6 text-dark">
              Sản Phẩm Dành Riêng Cho Bạn
            </h2>

            <p className="text-muted mt-2">
              Được gợi ý dựa trên hành vi và sở thích của bạn
            </p>

            <div className="d-flex justify-content-center mt-3">
              <span
                className="bg-primary"
                style={{
                  width: "120px",
                  height: "4px",
                  borderRadius: "999px",
                }}
              ></span>
            </div>
          </div>

          <ListSuggestionProducts />
          <div className="mb-5 mt-4 text-center">
            <h2 className="fw-bold display-6 text-dark">
              Danh Sách Sản Phẩm
            </h2>

            <p className="text-muted mt-2">
              Đây là danh sách sản phẩm của platform chúng tôi
            </p>

            <div className="d-flex justify-content-center mt-3">
              <span
                className="bg-primary"
                style={{
                  width: "120px",
                  height: "4px",
                  borderRadius: "999px",
                }}
              ></span>
            </div>
          </div>
          <PaginationProduct page={page} pathName="/shop?page=" />
        </div>
      </div>

      <Chatbot />
    </>
  );
};

export default ShopePage;
