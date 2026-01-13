import React from 'react'

const GetProductsByBusiness = async(shopId:string, page?:number) => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/shop/${shopId}?page=${page}`, {
        method:"GET", 
        headers:{
            "Content-Type":"application/json"
        }
    })

    if(res.ok){
        const data = await res.json();
        return data.products
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default GetProductsByBusiness
