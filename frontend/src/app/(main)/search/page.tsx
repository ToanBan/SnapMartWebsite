import SearchProfileClient from "@/app/components/SearchProfileClient";
import { cookies } from "next/headers";

const SearchPage = async ({ searchParams }: { searchParams: { query?: string } }) => {
  const query = searchParams.query || "";
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value
  let initialData = [];
  if (query) {
    const res = await fetch(`http://localhost:5000/api/search/profile?query=${query}`, {
      cache: "no-store", 
      headers:{
        Cookie:`token=${token}`
      }
    });
    const data = await res.json();
    initialData = data.message;
  }

  return (
    <div style={{ marginTop: "12rem" }}>
      <SearchProfileClient query={query} initialData={initialData} />
    </div>
  );
};

export default SearchPage;
