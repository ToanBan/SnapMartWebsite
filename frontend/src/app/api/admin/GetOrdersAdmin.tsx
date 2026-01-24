import { cookies } from 'next/headers'
import React from 'react'

const GetOrdersAdmin = async(page:number) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if(!token) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders?page=${page}`, {
        method:"GET", 
        headers:{
            "Content-Type" : "application/json", 
            Cookie:`token=${token}`
        }
    })
    if(res.ok){
        const data = await res.json();
        return data.message
    }
  } catch (error) {
    
  }
}

export default GetOrdersAdmin
