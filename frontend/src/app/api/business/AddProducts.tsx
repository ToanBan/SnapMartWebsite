import React from 'react'

const AddProducts = async(e:React.FormEvent<HTMLFormElement>) => {
  try {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const res = await fetch("http://localhost:5000/api/business/product/add", {
        method:"POST", 
        credentials:"include", 
        body:formData  
    })
    if(res.ok){
        const data = await res.json();
        return data.data
    }
  } catch (error) {
    console.error(error);
    return;
  }
}

export default AddProducts
