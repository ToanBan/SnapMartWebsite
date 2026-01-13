import React from "react";
import Image from "next/image";
import LoginPartialServer from "@/app/components/share/LoginPartialServer";
import SettingProfile from "@/app/components/share/SettingProfile";
import ProfileHeader from "@/app/components/share/ProfileHeader";
import { cookies } from "next/headers";
import PostProfile from "@/app/components/share/PostProfile";
import { Video, Heart } from "lucide-react";
import Posts from "@/app/components/Post";
import CountFollow from "@/app/components/CountFollow";
import SharePost from "@/app/components/SharePost";
interface PostProps {
  id: string;
  post_url: string;
  post_caption: string;
  type: string;
}

const ProfilePage = async () => {
  const account = await LoginPartialServer();
  const countFollow = await CountFollow();
  const cookieStore = cookies();
  const token = await (await cookieStore).get("token")?.value;
  const imageUrl = "http://localhost:5000/uploads/";
  let posts = [];
  let sharePosts = [];
  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    posts = data.message;
  } catch (error) {
    console.error(error);
    return;
  }


  try {
    const res = await fetch("http://localhost:5000/api/posts/share", {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    sharePosts = data.message;
  } catch (error) {
    console.error(error);
    return;
  }

  return (
    <>
      <div className="profile-container" style={{ marginTop: "8rem" }}>
        <ProfileHeader initialAccount={account} isOwnProfile countFollow={countFollow} />

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
              <Video size={18} className="me-2" /> Posts
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
    </>
  );
};

export default ProfilePage;
