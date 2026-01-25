export const dynamic = "force-dynamic";
import React from "react";
import GetAllProducts from "@/app/api/business/GetAllProducts";
import Pagination from "@/app/components/share/Pagination";
import ListProductBusiness from "@/app/components/ListProductBusiness";


const ListProducts = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const products = await GetAllProducts(page);
  return (
    <>
      <div
        className="container-xl py-5"
        style={{
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#f5f6fa",
        }}
      >
        <ListProductBusiness productsBusiness={products}/>

        <Pagination
          page={page}
          pathName={`${process.env.NEXT_PUBLIC_API_URL_FE}/business/products?page=`}
        />
      </div>
    </>
  );
};

export default ListProducts;
