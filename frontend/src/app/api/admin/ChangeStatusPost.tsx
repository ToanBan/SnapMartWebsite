import React from "react";

const ChangeStatusPost = async (postId: string, status: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/change-status`, {
      method: "POST",
      body: JSON.stringify({ postId, status }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default ChangeStatusPost;
