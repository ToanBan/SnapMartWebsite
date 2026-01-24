import React from "react";
import GetUsers from "@/app/api/admin/GetUsers";
import ListUsersAdmin from "@/app/components/ListUsersAdmin";
import Pagination from "@/app/components/share/Pagination";
const ListUsers = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;

  const data = await GetUsers(page);
  return (
    <>
      <div style={{width:"100%"}}>
        <ListUsersAdmin dataUsers={data} />
        <Pagination
          page={page}
          pathName={`${process.env.NEXT_PUBLIC_API_URL_FE}/admin/users/users?page=`}
        />
      </div>
    </>
  );
};

export default ListUsers;
