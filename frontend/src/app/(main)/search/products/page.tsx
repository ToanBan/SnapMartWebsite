import React from "react";
import searchProduct from "@/app/api/users/searchProduct";
import PaginationProduct from "@/app/components/PaginationProduct";
import TrackProductSearch from "@/app/components/TrackProductSearch";
const DisplayProductBySearch = async ({
  searchParams,
}: {
  searchParams: { query?: string, page?:string};
}) => {
  const query = searchParams.query || "";
  const page = searchParams.page || "";
  let SearchPage = Number(page)


  let data = [];
  if (query) {
    const result = await searchProduct(query, SearchPage);
    data = result.message;
  }

  return (
    <>
      <TrackProductSearch query={query}/>
      <div style={{ marginTop: "12rem" }}>
        <div className="container">
          <div className="text-center mb-4 mb-md-5">
            <h1 className="fw-bold display-6 display-md-5 text-dark">
              Kết Quả Tìm Kiếm
            </h1>

            {query && (
              <p className="text-muted mt-2">
                Từ khóa:{" "}
                <span className="fw-semibold text-primary">"{query}"</span>
              </p>
            )}

            <hr className="w-25 mx-auto mt-4 opacity-25" />
          </div>

          <PaginationProduct dataSearch={data} pathName={`/search/products?query=${query}&page=`} page={SearchPage}/>
        </div>
      </div>

    </>
  );
};

export default DisplayProductBySearch;
