export const dynamic = "force-dynamic";

import React from "react";
import GetRevenue from "@/app/api/business/GetRevenue";
import Dashboard from "@/app/components/Dashboard";
const BusinessPage = async () => {
  const data = await GetRevenue();

  return (
    <>
      <Dashboard data={data} />
    </>
  );
};

export default BusinessPage;
