import React from 'react'

const CheckBusiness = async() => {
  
  try {
    const res = await fetch(`http://localhost:5000/api/check_teacher`, {
        method:"GET", 
        credentials:"include", 
        headers:{
            "Content-Type":"application/json"
        }
    })

    if(res.ok){
        const data = await res.json();
        console.log(data);
    }
  } catch (error) {
    console.error(error);
    return;
  }
}

export default CheckBusiness
