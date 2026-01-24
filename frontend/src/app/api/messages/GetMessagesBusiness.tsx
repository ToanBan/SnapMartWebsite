import React from 'react'

const GetMessagesBusiness = async() => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages-business`, {
            method:"GET", 
            credentials:"include", 
            headers:{
                "Content-Type":"application/json"
            }
        })

        if(res.ok){
            const data = await res.json();
            return data.message;
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default GetMessagesBusiness
