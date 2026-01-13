import Image from "next/image";
import Link from "next/link";
import Posts from "@/app/components/Post";
import NavigationMain from "@/app/components/share/NavigationMain";
import LoginPartial from "./components/share/LoginPartial";
import GetPostsFollow from "./components/GetPostsFollow";
import PostProfile from "./components/share/PostProfile";
import GetPostsPublic from "./api/users/GetPostsPublic";
export default async function Home() {
  const data = await GetPostsFollow();
  const posts = Array.isArray(data) ? data : data?.data || [];
  const dataPublic = await GetPostsPublic();
  const postsPublic = dataPublic.map((post: any) => ({
    id: post.id,
    post_caption: post.title,
  }));


  

  return (
    <>
      <NavigationMain loginPartial={<LoginPartial />} />
      <PostProfile initialPosts={posts} postsPublic={postsPublic}/>
    </>
  );
}
