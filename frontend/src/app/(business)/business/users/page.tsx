import React from "react";
import GetUserProducts from "@/app/api/business/GetUserProducts";
import dayjs from "dayjs";
import ModalProduct from "@/app/components/ModalProduct";
import UserTable from "@/app/components/business/UserTable";

const UserPage = async () => {
  const data = await GetUserProducts();
  console.log(data);

  return (
    <>
      <UserTable data={data}/>
    </>
  );
};

export default UserPage;
