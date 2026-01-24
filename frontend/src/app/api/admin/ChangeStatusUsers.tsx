import React from 'react'

const ChangeStatusUsers = async(userId:string, status:string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/change-status`, {
        method:"POST", 
        body:JSON.stringify({userId, status}),
        headers:{
            "Content-Type" : "application/json"
        }, 
        credentials:"include"
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

export default ChangeStatusUsers
