import React from 'react'

const GetProductApproved = async(page:number) => {
  try {
    const res = await fetch(`http://localhost:5000/api/products?page=${page}`, {
        method:"GET", 
        headers:{
            "Content-Type":"application/json"
        }, 
    })

    if(res.ok){
        const data = await res.json();
        return data.message;
    }
  } catch (error) {
    console.error("Error fetching approved products:", error);
    return [];
  }
}

export default GetProductApproved
