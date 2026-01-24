import { cookies } from "next/headers";


export default async function GetProfileDetail({profileId}:{profileId:string}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  let profile = null;
  if (token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${profileId}`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });
    if (res.ok){
      profile = await res.json();
    } 
  }

  return profile;
}
