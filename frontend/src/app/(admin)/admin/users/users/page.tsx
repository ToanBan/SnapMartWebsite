import React from "react";
import ListAllUsersAdmin from "@/app/components/ListAllUsersAdmin";
import Pagination from "@/app/components/share/Pagination";
import GetAllUsersAdmin from "@/app/api/admin/GetAllUsersAdmin";
const UsersPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const users = await GetAllUsersAdmin(page);

  return (
    <>
      <div style={{width:"100%"}}>
        <ListAllUsersAdmin usersData={users} />
        <Pagination
          page={page}
          pathName={`http://localhost:3000/admin/users/users?page=`}
        />
      </div>
    </>
  );
};

export default UsersPage;
