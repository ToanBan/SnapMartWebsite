import { cookies } from "next/headers";
import React from "react";

const GetPostsFollow = async () => {
  const cookieStore = await cookies();
  const token = await cookieStore.get("token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/follow`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie:`token=${token}`
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return;
  }
};

export default GetPostsFollow;
