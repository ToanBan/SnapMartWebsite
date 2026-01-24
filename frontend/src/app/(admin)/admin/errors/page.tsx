import React from 'react'
import Pagination from '@/app/components/share/Pagination'
import GetErrors from '@/app/api/admin/GetErrors'
import ListErrorAdmin from '@/app/components/ListErrorAdmin'
const ErrorsPage = async({searchParams}:{searchParams:{page?:string}}) => {
  const page = Number(searchParams.page) || 1;
  const errors = await GetErrors(page);
  return (
    <>
      <div className='mt-5' style={{width:"100%"}}>
        <ListErrorAdmin errors={errors}/>
        <Pagination page={page} pathName={`${process.env.NEXT_PUBLIC_API_URL_FE}/admin/errors?page=`}/>
      </div>
    </>
  )
}

export default ErrorsPage
