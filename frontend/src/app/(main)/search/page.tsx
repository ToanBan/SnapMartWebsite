import SearchProfileClient from "@/app/components/SearchProfileClient";
import { cookies } from "next/headers";


interface PageProps {
  searchParams: Promise<{ query?: string }>;
}

const SearchPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query || "";
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
 
  let initialData = [];
  if (query) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/profile?query=${encodeURIComponent(query)}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`, 
          Cookie: `token=${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        initialData = data.message || [];
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <div style={{ marginTop: "12rem" }}>
      <SearchProfileClient query={query} initialData={initialData} />
    </div>
  );
};

export default SearchPage;