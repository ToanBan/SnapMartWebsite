import React from 'react'
import Pagination from '@/app/components/share/Pagination'
import GetErrors from '@/app/api/admin/GetErrors'
import ListErrorAdmin from '@/app/components/ListErrorAdmin'
const ErrorsPage = async({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const errors = await GetErrors(page);
  return (
    <>
      <div className='mt-5' style={{width:"100%"}}>
        <ListErrorAdmin errors={errors}/>
        <Pagination page={page} pathName="/admin/errors"/>
      </div>
    </>
  )
}

export default ErrorsPage
