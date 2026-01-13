"use client";

import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
interface UserInfo {
  avatar: string;
  username: string;
  id: string;
}

interface SharedPostProps {
  id: string;
  post_url: string | null;
  post_caption: string;
  type: string;
  updatedAt: string;
  user: UserInfo;
}

interface PostProps {
  id: string;
  post_url: string | null;
  post_caption: string;
  type: string;
  updatedAt: string;
  user: UserInfo;
  reactionCount: number;
  PostReactions: { reactionType: string }[];
  sharedPost?: SharedPostProps | null;
}

const SharePost = ({ posts }: { posts: PostProps[] }) => {
  const imageUrl = "http://localhost:5000/uploads/";

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center gap-4 mt-5"
      style={{ marginTop: "120px" }}
    >
      {Array.isArray(posts) &&
        posts.map((post) => (
          <div className="post-card w-100" key={post.id}>
            {/* 🧍 Header người đăng */}
            <div className="d-flex align-items-center justify-content-between post-header">
              <div className="d-flex align-items-center">
                <Image
                  className="rounded-circle me-3 user-avatar"
                  alt="avatar"
                  width={50}
                  height={50}
                  src={
          post.user.avatar
            ? `${imageUrl}${post.user.avatar}`
            : "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
        }
                  
                />
                <div>
                  <h5 className="username mb-0">{post.user.username}</h5>
                  <small className="text-muted">
                    {dayjs(post.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </small>
                </div>
              </div>
            </div>

            {post.post_caption && (
              <div className="post-caption mt-2">
                <p className="caption-text mb-0">
                  <span className="caption-username fw-semibold">
                    {post.user.username}
                  </span>{" "}
                  {post.post_caption}
                </p>
              </div>
            )}

            {/* 🔁 Nếu là bài chia sẻ */}
            {post.sharedPost ? (
              <div
                className="shared-post mt-3 p-3 rounded"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                }}
              >
                {/* Header bài gốc */}
                <div className="d-flex align-items-center mb-2">
                  <Image
                    className="rounded-circle me-3 user-avatar"
                    alt="avatar"
                    width={40}
                    height={40}
                   
                     src={
          post.sharedPost.user.avatar
            ? `${imageUrl}${post.sharedPost.user.avatar}`
            : "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
        }
                  />
                  <div>
                    <Link className="text-decoration-none text-dark" href={`/profile/${post.sharedPost.user.id}`}>
                      <h6 className="mb-0">{post.sharedPost.user.username}</h6>
                    </Link>

                    <small className="text-muted">
                      {dayjs(post.sharedPost.updatedAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </small>
                  </div>
                </div>

                {/* Ảnh hoặc video bài gốc */}
                <div className="post-media-content">
                  {post.sharedPost.type === "image" &&
                    post.sharedPost.post_url && (
                      <Image
                        className="img-fluid rounded"
                        alt="shared_image"
                        width={550}
                        height={350}
                        src={imageUrl + post.sharedPost.post_url}
                      />
                    )}

                  {post.sharedPost.type === "video" &&
                    post.sharedPost.post_url && (
                      <video
                        className="img-fluid rounded"
                        controls
                        width={550}
                        height={350}
                      >
                        <source
                          src={imageUrl + post.sharedPost.post_url}
                          type="video/mp4"
                        />
                      </video>
                    )}
                </div>

                {/* Caption bài gốc */}
                {post.sharedPost.post_caption && (
                  <div className="post-caption mt-2">
                    <p className="caption-text mb-0">
                      <span className="caption-username fw-semibold">
                        {post.sharedPost.user.username}
                      </span>{" "}
                      {post.sharedPost.post_caption}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="post-media-content mt-3">
                {post.type === "image" && post.post_url && (
                  <Image
                    className="img-fluid rounded"
                    alt="image_post"
                    width={600}
                    height={400}
                    src={imageUrl + post.post_url}
                  />
                )}

                {post.type === "video" && post.post_url && (
                  <video
                    className="img-fluid rounded"
                    controls
                    width={600}
                    height={400}
                  >
                    <source src={imageUrl + post.post_url} type="video/mp4" />
                  </video>
                )}
              </div>
            )}

            <div className="post-footer mt-3">
              <div className="d-flex justify-content-between align-items-center interaction-stats">
                <small>
                  <i className="bi bi-heart-fill text-danger me-1"></i>
                  {post.reactionCount} Lượt Thích
                </small>
                <small>120 Bình Luận &bull; 80 Chia Sẻ</small>
              </div>

              <div className="d-flex justify-content-around align-items-center border-top pt-3 interaction-buttons">
                <button className="btn btn-light btn-sm">
                  <i className="bi bi-chat-dots me-1"></i> Bình luận
                </button>
                <button className="btn btn-light btn-sm">
                  <i className="bi bi-share me-1"></i> Chia sẻ
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SharePost;
