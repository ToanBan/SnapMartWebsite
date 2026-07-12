import React from 'react'

const GetPostsPublic = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/public`, {
        method: "GET", 
        headers: {
            "Content-Type" : "application/json"
        },
        // We can add cache strategy if needed, e.g. cache: 'no-store'
        cache: 'no-store'
    })

    if(res.ok){
        const data = await res.json();
        return data.data; // The backend returns { data: posts, nextCursor }
    }
    return [];
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return [];
  }
}

export default GetPostsPublic
