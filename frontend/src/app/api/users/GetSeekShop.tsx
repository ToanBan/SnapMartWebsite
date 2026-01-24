import React from 'react'

const GetSeekShop = async(slug:string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop/${slug}`, {
        method:"GET", 
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
    return null;
  }
}

export default GetSeekShop
