import { cookies } from 'next/headers';
import React from 'react'

const GetAllProducts = async(page:number) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if(!token) return
  try {
    const res = await fetch(`http://localhost:5000/api/business/product?page=${page}`, {
        method:"GET", 
        headers:{
            "Content-Type":"application/json", 
            Cookie:`token=${token}`
        }, 
    })

    if(res.ok){
        const data = await res.json();
        console.log("Data products business:", data);
        return data.message;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default GetAllProducts
