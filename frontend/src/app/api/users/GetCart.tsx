import { cookies } from "next/headers";

const GetCart = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, message: "No authentication token found" };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Failed to fetch cart" };
    }

    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error("Error getting cart:", error);
    return { success: false, message: "Failed to get cart" };
  }
};

export default GetCart;
