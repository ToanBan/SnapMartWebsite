"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ProfileProps {
  id: string;
  username: string;
  avatar: string;
}

const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;

const SearchProfileClient = ({
  query,
  initialData,
}: {
  query: string;
  initialData: ProfileProps[];
}) => {
  const [profiles, setProfiles] = useState<ProfileProps[]>(initialData);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (query) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search/profile?query=${query}`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setProfiles(Array.isArray(data.message) ? data.message : []);
      } else {
        setProfiles([]);
      }
    };

    fetchProfiles();
  }, [query]);
  const RedirectToProfileDetail = (
    e: React.MouseEvent<HTMLButtonElement>,
    profileId: string,
  ) => {
    e.preventDefault();
    if (profileId) {
      window.location.href = `/profile/${profileId}`;
    }
  };

  

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
      {profiles.length > 0 ? (
        profiles.map((profile) => (
          <div className="col" key={profile.id}>
            <div className="profile-card card rounded-5 p-4 text-center">
              <Image
                width={50}
                height={50}
                className="img-fluid rounded-circle mb-4 mx-auto"
                style={{ width: "112px", height: "112px", objectFit: "cover" }}
                src={`${profile.avatar ? `${imageUrl}${profile.avatar}` : `https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png`}`}
                alt="avatar-profile"
              />
              <h3 className="h5 fw-bold text-dark mb-4">{profile.username}</h3>
              <button
                onClick={(e) => RedirectToProfileDetail(e, profile.id)}
                className="btn btn-primary rounded-pill view-profile-btn w-100 py-3 shadow-sm"
              >
                Xem Chi Tiết
              </button>
            </div>
          </div>
        ))
      ) : (
        <div
          className="no-result d-flex justify-content-center align-items-center w-100"
          style={{ minHeight: "300px" }}
        >
          <p
            style={{
              fontSize: "2rem",
              fontWeight: 600,
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
            }}
          >
            KHÔNG TÌM THẤY HỒ SƠ
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchProfileClient;
