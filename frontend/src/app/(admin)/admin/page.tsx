export const dynamic = "force-dynamic";
import React from "react";
import Dashboard from "@/app/components/Dashboard";
import GetRevenueAdmin from "@/app/api/admin/GetRevenueAdmin";
const DashboardPage = async () => {
  const data = await GetRevenueAdmin();

  return (
    <>
      <Dashboard data={data} isAdmin />
    </>
  );
};

export default DashboardPage;
