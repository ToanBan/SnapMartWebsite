import { cookies } from 'next/headers';
import React from 'react'

const GetOrders = async(page:number) => {
  const cookieStores = cookies();
  const token = (await cookieStores).get("token")?.value;
  if(!token) return
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?page=${page}`, {
        method:"GET", 
        headers:{
            "Content-Type":"application/json", 
            Cookie:`token=${token}`
        }
    })

    if(res.ok){
        const data = await res.json();
        
        return data.message;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default GetOrders
