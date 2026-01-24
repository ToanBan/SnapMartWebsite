import { cookies } from 'next/headers';
import React from 'react'

const GetErrors = async(page:number) => {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    if(!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/errors?page=${page}`, {
        method:"GET", 
        headers:{
            "Content-Type":"application/json", 
            Cookie:`token=${token}`
        }
    })

    if(res.ok){
        const data = await res.json();
        return data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default GetErrors
