import React from 'react'

const GetPostsPublic = async() => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method:"GET", 
        headers:{
            "Content-Type" : "application/json"
        }
    })

    if(res.ok){
        const data = await res.json();
        return data;
    }
  } catch (error) {
    
  }
}

export default GetPostsPublic
