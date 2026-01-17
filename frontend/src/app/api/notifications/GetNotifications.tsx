import React from 'react'

const GetNotifications = async() => {
  try {
    const res = await fetch("http://localhost:5000/api/notifications", {
        method:"GET", 
        headers:{
            "Content-Type":"application/json"
        }, 
        credentials:"include"
    })

    if(res.ok){
        const data = await res.json();
        return data.message
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default GetNotifications
