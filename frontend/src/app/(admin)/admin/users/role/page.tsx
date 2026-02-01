import React from "react";
import GetUsers from "@/app/api/admin/GetUsers";
import ListUsersAdmin from "@/app/components/ListUsersAdmin";
import Pagination from "@/app/components/share/Pagination";

const ListUsers = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const data = await GetUsers(page);

  return (
    <div style={{ width: "100%" }}>
      <ListUsersAdmin dataUsers={data} />
  
      <Pagination 
        page={page} 
        pathName="/admin/users/users" 
      />
    </div>
  );
};

export default ListUsers;