import React from "react";
import ProfileHeader from "@/app/components/share/ProfileHeader";
import PostProfile from "@/app/components/share/PostProfile";
import { Video, Heart } from "lucide-react";
import CountFollow from "@/app/components/CountFollow";
import SharePost from "@/app/components/SharePost";
import Posts from "@/app/components/Post";

const ProfileDetail = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  let initialData;
  let posts = [];
  let sharePosts = [];
  try {
    if (slug) {
      const res = await fetch(`http://localhost:5000/api/profile/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(data=> data.json());

      const resPost = await fetch(`http://localhost:5000/api/user/posts/${slug}`, {
        method:"GET", 
        headers:{
          "Content-Type":"application/json"
        }
      }).then(data => data.json())
      
      const [profileData, postData] = await Promise.all([res, resPost])
      initialData = profileData.message;
      posts = postData.message
      
    }
  } catch (error) {
    console.error(error);
    return null;
  }


   try {
    const res = await fetch(`http://localhost:5000/api/posts/share/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "userID": slug
      },
    });

    const data = await res.json();
    console.log(data)
    sharePosts = data.message;
  } catch (error) {
    console.error(error);
    return;
  }

  const countFollow = await CountFollow(slug);
  return (
    <div className="profile-container" style={{ marginTop: "8rem" }}>
      <ProfileHeader initialAccount={initialData} profileId={slug} countFollow={countFollow}/>

      <ul className="nav nav-tabs" id="profileTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="videos-tab"
            data-bs-toggle="tab"
            data-bs-target="#videos"
            type="button"
            role="tab"
            aria-controls="videos"
            aria-selected="true"
          >
            <Video size={18} className="me-2" />  Posts
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="liked-tab"
            data-bs-toggle="tab"
            data-bs-target="#liked"
            type="button"
            role="tab"
            aria-controls="liked"
            aria-selected="false"
          >
             <Heart size={18} className="me-2" /> Share
          </button>
        </li>
      </ul>

      <div className="tab-content" id="profileTabsContent">
          <div
            className="tab-pane fade show active"
            id="videos"
            role="tabpanel"
            aria-labelledby="videos-tab"
          >
            <Posts posts={posts} postCreator={false}/>
          </div>

          <SharePost posts={sharePosts}/>
        </div>
    </div>
  );
};

export default ProfileDetail;
