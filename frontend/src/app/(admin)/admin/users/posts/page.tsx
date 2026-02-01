import React from "react";
import GetPostsAdmin from "@/app/api/admin/GetPostsAdmin";
import ListPostsAdmin from "@/app/components/ListPostsAdmin";
import Pagination from "@/app/components/share/Pagination";
const PostsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const posts = await GetPostsAdmin(page);
  
  return (
    <>
      <div style={{ width: "100%" }} className="mt-5">
        <ListPostsAdmin dataPosts={posts} />
        <Pagination
          page={page}
          pathName="/admin/users/posts"
        />
      </div>
    </>
  );
};

export default PostsPage;
