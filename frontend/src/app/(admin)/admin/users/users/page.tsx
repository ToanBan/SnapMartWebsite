import React from "react";
import ListAllUsersAdmin from "@/app/components/ListAllUsersAdmin";
import Pagination from "@/app/components/share/Pagination";
import GetAllUsersAdmin from "@/app/api/admin/GetAllUsersAdmin";
const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const users = await GetAllUsersAdmin(page);

  return (
    <>
      <div style={{ width: "100%" }}>
        <ListAllUsersAdmin usersData={users} />
        <Pagination
          page={page}
          pathName="/admin/users/users"
        />
      </div>
    </>
  );
};

export default UsersPage;
