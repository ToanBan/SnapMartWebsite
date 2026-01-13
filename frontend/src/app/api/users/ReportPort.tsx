import React from 'react'

const ReportPort = async(postId:string) => {
  try {
    const res = await fetch(`http://localhost:5000/api/posts/report/${postId}`, {
        method:"POST", 
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

export default ReportPort
