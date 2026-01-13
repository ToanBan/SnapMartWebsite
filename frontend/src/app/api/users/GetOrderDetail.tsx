import { cookies } from 'next/headers';
import React from 'react'

const GetOrdersDetail = async(orderId:string) => {
  const cookieStores = await cookies();
  const token = cookieStores.get('token')?.value || '';
  try {
    const res = await fetch(`http://localhost:5000/api/user/orders/${orderId}`, {
        method:"GET", 
        headers:{
            "Content-Type":"application/json",
            Cookie: `token=${token}`
        }
    })
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching orders:', error)
    return [];
  }
}

export default GetOrdersDetail
