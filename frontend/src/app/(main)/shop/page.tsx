import Chatbot from "@/app/components/Chatbot";
import SearchProducts from "@/app/components/SearchProducts";
import PaginationProduct from "@/app/components/PaginationProduct";
import TrackSendActionView from "@/app/components/TrackSendActionView";
import ListSuggestionProducts from "@/app/components/ListSuggestionProducts";

interface ShopPageProps {
  searchParams: Promise<{ page?: string }>;
}

const ShopePage = async ({ searchParams }: ShopPageProps) => {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  return (
    <>
      <TrackSendActionView />

      <div style={{ marginTop: "12rem" }}>
        <div className="container">
          <SearchProducts />

          <ListSuggestionProducts />
          <div className="mb-5 mt-4 text-center">
            <h2 className="fw-bold display-6 text-dark">Danh Sách Sản Phẩm</h2>

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
