import { cookies } from "next/headers";


export default async function LoginPartialServer() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  let account = null;
  if (token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    if (res.ok){
      account = await res.json();
    } 
  }

  return account;
}
