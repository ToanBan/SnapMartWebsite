import React from 'react'

const HandleStatusOrder = async(orderId:number, status:string) => {
  try {
    if(!orderId || !status){
        return null;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
        method:"POST", 
        body:JSON.stringify({status}), 
        credentials:"include", 
        headers:{
            "Content-Type":"application/json"
        }
    })

    if(res.ok){
        const data = await res.json();
        return data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default HandleStatusOrder
