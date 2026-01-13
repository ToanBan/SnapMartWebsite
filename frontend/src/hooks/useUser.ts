"use client";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Fetch error");
  return res.json();
};

export const useUser = (initialData?: any) => {
  const { data, mutate, error } = useSWR(
    "http://localhost:5000/api/user",
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnMount: !initialData,
    }
  );
  return {
    account: data?.message,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
