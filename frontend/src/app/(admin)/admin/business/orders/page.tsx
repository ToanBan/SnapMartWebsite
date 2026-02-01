import React from 'react'
import GetOrdersAdmin from '@/app/api/admin/GetOrdersAdmin'
import ListOrdersAdmin from '@/app/components/ListOrdersAdmin';
import Pagination from '@/app/components/share/Pagination';
const OrdersPage = async({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const orders = await GetOrdersAdmin(page)  
  return (
    <>
      <div className='mt-5' style={{width:"100%"}}>
        <ListOrdersAdmin orders={orders}/>
        <Pagination page={page} pathName="/admin/business/orders"/>
      </div>
    </>
  )
}

export default OrdersPage
