import { cookies } from "next/headers";

const CountFollow = async (userId?:string) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if (!token) {
    console.error("Not Found Token");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/follow/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    });

    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Server Error");
    return [];
  }
};

export default CountFollow;
