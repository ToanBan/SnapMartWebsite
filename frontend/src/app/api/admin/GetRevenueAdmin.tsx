import { cookies } from 'next/headers';
import React from 'react'

const GetRevenueAdmin = async() => {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    if(!token) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/revenue`, {
        method:"GET", 
        headers:{
            "Content-Type":"application/json",
            Cookie:`token=${token}`
        },
        cache:"no-store"
    })

    if(res.ok){
        const data = await res.json();
        return data
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default GetRevenueAdmin
