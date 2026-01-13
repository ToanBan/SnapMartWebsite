"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SettingProfile from "./SettingProfile";
import { useUser } from "@/hooks/useUser";

interface CountFollowProps {
  follower: string;
  following: string;
}

const ProfileHeader = ({
  initialAccount,
  isOwnProfile = false,
  profileId,
  countFollow,
}: {
  initialAccount: any;
  isOwnProfile?: boolean;
  profileId?: string;
  countFollow?: CountFollowProps;
}) => {
  const imageUrl = "http://localhost:5000/uploads/";

  const { account, isLoading, isError } = isOwnProfile
    ? useUser(initialAccount)
    : { account: initialAccount, isLoading: false, isError: false };

  const [follower, setFollower] = useState(countFollow?.follower);
  const [following, setFollowing] = useState(countFollow?.following);
  const [likes, setLikes] = useState(0);
  const [statusFollow, setStatusFollow] = useState("Follow");

  
  

  const HandleToggleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/follow/${profileId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        setStatusFollow("Unfollow");
        setFollower((prev) => (prev ? String(Number(prev) + 1) : "1"));
      } else {
        setStatusFollow("Follow");
        setFollower((prev) =>
          prev && Number(prev) > 0 ? String(Number(prev) - 1) : "0"
        ); 
      }

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const CheckFollow = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/follow/${profileId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        setStatusFollow("UnFollow");
      } else {
        setStatusFollow("Follow");
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };


  useEffect(()=>{
    if(!account) return;
    localStorage.setItem("userId", account.id);
  }, [])

  useEffect(() => {
    if (profileId) {
      CheckFollow();
    }
  }, []);




  return (
    <div className="profile-header d-flex flex-column align-items-center text-center">
      <Image
        src={
          account?.avatar
            ? `${imageUrl}${account?.avatar}`
            : "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
        }
        alt="avatar-profile"
        width={70}
        height={70}
        className="profile-avatar"
      />

      <h3 className="profile-username">{account?.username}</h3>
      <p className="profile-handle">{account?.email}</p>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{follower}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{following}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{likes}</span>
          <span className="stat-label">Likes</span>
        </div>
      </div>

      <div className="profile-actions d-flex justify-content-center mb-4">
        {!isOwnProfile && (
          <>
            <button onClick={HandleToggleFollow} className="btn btn-primary">
              {statusFollow}
            </button>
            <button className="btn btn-outline-secondary">Message</button>
          </>
        )}

        {isOwnProfile && <SettingProfile />}
      </div>

      <p className="profile-bio">{account?.description}</p>
    </div>
  );
};

export default ProfileHeader;
