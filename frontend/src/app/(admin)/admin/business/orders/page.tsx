export const dynamic = "force-dynamic";
import React from 'react'
import GetOrdersAdmin from '@/app/api/admin/GetOrdersAdmin'
import ListOrdersAdmin from '@/app/components/ListOrdersAdmin';
import Pagination from '@/app/components/share/Pagination';
const OrdersPage = async({searchParams}:{searchParams:{page?:string}}) => {
  const page = Number(searchParams.page) || 1;
  const orders = await GetOrdersAdmin(page)  
  return (
    <>
      <div className='mt-5' style={{width:"100%"}}>
        <ListOrdersAdmin orders={orders}/>
        <Pagination page={page} pathName={`${process.env.NEXT_PUBLIC_API_URL_FE}/admin/business/orders?page=`}/>
      </div>
    </>
  )
}

export default OrdersPage
