import React from "react";
import GetPostsAdmin from "@/app/api/admin/GetPostsAdmin";
import ListPostsAdmin from "@/app/components/ListPostsAdmin";
import Pagination from "@/app/components/share/Pagination";
const PostsPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;


  const posts = await GetPostsAdmin(page);
  
  return (
    <>
      <div style={{ width: "100%" }} className="mt-5">
        <ListPostsAdmin dataPosts={posts} />
        <Pagination
          page={page}
          pathName={`${process.env.NEXT_PUBLIC_API_URL_FE}/admin/users/posts?page=`}
        />
      </div>
    </>
  );
};

export default PostsPage;
