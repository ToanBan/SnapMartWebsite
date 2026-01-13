import React from 'react'

const HandleChangeRole = async(role:string, userId:string) => {
  try {
    const res = await fetch("http://localhost:5000/api/admin/change-role", {
        method:"POST", 
        body:JSON.stringify({role, userId}), 
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

export default HandleChangeRole
