import React from 'react'

const GetProductsPending = async() => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/business/products`, {
        method:"GET", 
        credentials:"include", 
        headers:{
            "Content-Type":"application/json"
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

export default GetProductsPending
