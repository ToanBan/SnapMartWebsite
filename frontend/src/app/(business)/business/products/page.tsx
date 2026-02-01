import React from "react";
import GetAllProducts from "@/app/api/business/GetAllProducts";
import Pagination from "@/app/components/share/Pagination";
import ListProductBusiness from "@/app/components/ListProductBusiness";


const ListProducts = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>; 
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  console.log("Business Products Page number:", page);
  const products = await GetAllProducts(page);

  return (
    <div
      className="container-xl py-5"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#f5f6fa",
      }}
    >
      <ListProductBusiness productsBusiness={products} />

      <Pagination
        page={page}
        // Truyền path sạch, tham số query sẽ nối trong component
        pathName="/business/products" 
      />
    </div>
  );
};

export default ListProducts;