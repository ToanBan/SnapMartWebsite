"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import ReactionPost from "./ReactionPost";
import CommentPost from "./CommentPost";
import socket from "@/lib/socket";
import ShareButton from "./SharePostButton";
import { Globe, Users, ChevronDown } from "lucide-react";
import ReportPort from "@/app/api/users/ReportPort";
import AlertSuccess from "./AlertSuccess";
import { success } from "zod";
import PostCreator from "../PostCreator";
interface PostProps {
  id: string;
  post_url: string | null;
  post_caption: string;
  posts_like: string;
  type: string;
  user: {
    avatar: string;
    username: string;
  };
  updatedAt: string;
  PostReactions: {
    reactionType: string;
  }[];
  reactionCount: number;
}

const PostProfile = ({
  initialPosts,
  postsPublic,
}: {
  initialPosts: PostProps[];
  postsPublic: any[];
}) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/`;
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState("public");
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = React.useRef<HTMLDivElement | null>(null);
  const toggleComments = (postId: string) => {
    setCommentPostId((prev) => (prev === postId ? null : postId));
  };

  const JoinRoom = (postId: string) => {
    socket.emit("joinPostRoom", `post-${postId}`);
  };

  const handleSelect = (type: string) => {
    setPrivacy(type);
  };

  const handleReportPost = async () => {
    if (!openPostId) return;
    const result = await ReportPort(openPostId);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  const fetchPostsMore = useCallback(async () => {
    if (loading || !hasMore || privacy !== "friends") return;

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/follow?cursor=${cursor ?? ""}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!res.ok) return;
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setPosts((prev) => {
          const newPosts = data.data.filter(
            (newPost: PostProps) => prev.some((p) => p.id !== newPost.id),
          );
          return [...prev, ...newPosts];
        });

        setCursor(data.nextCursor);
      }

      if (!data.nextCursor || data.data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, privacy]);

  useEffect(() => {
    if (privacy !== "friends") {
      console.log("Privacy !== friends → không setup observer");
      return;
    }

    if (!observerRef.current) {
      console.log("observerRef chưa có");
      return;
    }

    console.log("Setup IntersectionObserver (friends)");

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          fetchPostsMore();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(observerRef.current);

    return () => {
      console.log("Cleanup observer");
      observer.disconnect();
    };
  }, [privacy, cursor, hasMore]);

  return (
    <>
      <div
        className="container-fluid d-flex"
        style={{
          flexFlow: "column",
          alignItems: "center",
          gap: "20px",
          marginTop: "120px",
        }}
      >
        <PostCreator />
        {privacy === "friends" &&
          Array.isArray(posts) &&
          posts.map((post, index) => (
            <div className="post-card" key={index}>
              <div className="d-flex align-items-center justify-content-between post-header">
                <div className="d-flex align-items-center">
                  <Image
                    className="rounded-circle me-3 user-avatar"
                    alt="avatar"
                    width={50}
                    height={50}
                    src={`${post.user.avatar ? `${imageUrl}${post.user.avatar}` : `https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png`}`}
                  />
                  <div>
                    <h5 className="username">{post.user.username}</h5>
                    <small className="post-time">
                      {dayjs(post.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </small>
                  </div>
                </div>

                <div className="post-options">
                  <button
                    className="post-options-btn"
                    onClick={() =>
                      setOpenPostId(openPostId === post.id ? null : post.id)
                    }
                  >
                    ⋯
                  </button>

                  {openPostId === post.id && (
                    <div className="post-options-menu">
                      <button
                        onClick={handleReportPost}
                        className="post-options-item"
                      >
                        🚩 Báo cáo bài viết
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="post-media-content">
                {post.type === "image" && post.post_url && (
                  <Image
                    className="img-fluid post-media"
                    alt="image_post"
                    width={600}
                    height={400}
                    src={imageUrl + post.post_url}
                  />
                )}

                {post.type === "video" && post.post_url && (
                  <video
                    className="img-fluid post-media"
                    controls
                    width={600}
                    height={400}
                  >
                    <source src={imageUrl + post.post_url} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>
                )}
              </div>

              {/* ===== CAPTION ===== */}
              <div className="post-caption">
                <p className="caption-text">
                  <span className="caption-username">{post.user.username}</span>{" "}
                  {post.post_caption}
                </p>
              </div>

              {/* ===== FOOTER ===== */}
              <div className="post-footer">
                <div className="d-flex justify-content-between align-items-center interaction-stats">
                  <small>
                    <i className="bi bi-heart-fill text-danger me-1"></i> 1.5K
                    Lượt Thích
                  </small>
                  <small>120 Bình Luận &bull; 80 Chia Sẻ</small>
                </div>

                <div className="d-flex justify-content-around align-items-center border-top pt-3 interaction-buttons">
                  <ReactionPost
                    postId={post.id}
                    typeReaction={post.PostReactions[0]?.reactionType}
                    reactionCount={post.reactionCount}
                  />

                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => {
                      toggleComments(post.id);
                      JoinRoom(post.id);
                    }}
                  >
                    <i className="bi bi-chat-dots me-1"></i> Bình luận
                  </button>

                  <ShareButton postId={post.id} />
                </div>

                {commentPostId === post.id && <CommentPost postId={post.id} />}
              </div>
            </div>
          ))}
        <div ref={observerRef} style={{ height: "1px" }} />

        {privacy == "public" &&
          Array.isArray(postsPublic) &&
          postsPublic.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="d-flex align-items-center justify-content-between post-header">
                <div className="d-flex align-items-center">
                  <Image
                    className="rounded-circle me-3 user-avatar"
                    alt="avatar"
                    width={50}
                    height={50}
                    src={`https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png`}
                  />
                  <div>
                    <h5 className="username">Public</h5>
                    <small className="post-time">
                      {dayjs(new Date()).format("DD/MM/YYYY HH:mm")}
                    </small>
                  </div>
                </div>
              </div>

              <div className="post-caption">
                <p className="caption-text">
                  <span className="caption-username">Public</span>{" "}
                  {post.post_caption}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="fixed-top-right">
        <div className="dropdown">
          <button
            className="btn btn-privacy dropdown-toggle"
            type="button"
            id="privacyDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {privacy === "public" ? (
              <Globe size={18} color="#4f46e5" />
            ) : (
              <Users size={18} color="#4f46e5" />
            )}
            <span className="current-text">
              {privacy === "public" ? "Công khai" : "Bạn bè"}
            </span>
            <ChevronDown size={16} className="chevron-icon" />
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end dropdown-menu-privacy"
            aria-labelledby="privacyDropdown"
          >
            <li>
              <button
                className={`dropdown-item dropdown-item-privacy ${
                  privacy === "public" ? "active-item" : ""
                }`}
                onClick={() => handleSelect("public")}
              >
                <div className="icon-wrapper">
                  <Globe size={20} />
                </div>
                <div>
                  <span className="item-title">Công khai</span>
                  <span className="item-desc">Ai cũng có thể thấy</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`dropdown-item dropdown-item-privacy ${
                  privacy === "friends" ? "active-item" : ""
                }`}
                onClick={() => handleSelect("friends")}
              >
                <div className="icon-wrapper">
                  <Users size={20} />
                </div>
                <div>
                  <span className="item-title">Bạn bè</span>
                  <span className="item-desc">Chỉ bạn bè của bạn</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {success && <AlertSuccess message="Báo Cáo Thành Công" />}
      <style>{`
        /* Container định vị */
        .fixed-top-right {
            position: fixed;
            top: 8rem;
            left: 5rem;
            z-index: 1050;
        }

        /* Style cho nút chính - Tối ưu cho nền trắng */
        .btn-privacy {
            background: #ffffff;
            border: 1px solid #e5e7eb; /* Viền xám nhạt tinh tế */
            border-radius: 12px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            transition: all 0.2s ease;
            font-weight: 500;
            color: #374151; /* Màu chữ xám đậm hiện đại */
        }

        .btn-privacy:hover {
            background: #f9fafb;
            border-color: #d1d5db;
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
        }

        .current-text {
            font-size: 0.95rem;
        }

        .chevron-icon {
            opacity: 0.4;
            margin-left: 4px;
        }

        /* Tùy chỉnh Dropdown Menu */
        .dropdown-menu-privacy {
            border: 1px solid #f3f4f6;
            border-radius: 16px;
            padding: 8px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            min-width: 240px;
            margin-top: 10px !important;
            background: #ffffff;
            animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item-privacy {
            border-radius: 10px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #4b5563;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            background: transparent;
            width: 100%;
            text-align: left;
        }

        .dropdown-item-privacy:hover {
            background-color: #f3f4f6;
            color: #4f46e5;
        }

        .active-item {
            background-color: #f0f0ff;
            color: #4f46e5;
        }

        .item-title {
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            color: #111827;
        }

        .item-desc {
            display: block;
            font-size: 0.75rem;
            color: #6b7280;
        }

        /* Loại bỏ mũi tên mặc định của Bootstrap */
        .dropdown-toggle::after {
            display: none;
        }

        /* Mobile Responsive */
        @media (max-width: 576px) {
            .fixed-top-right {
                top: 1rem;
                right: 1rem;
            }
        }

        /* ===== POST OPTIONS (3 DOT MENU) ===== */
.post-options {
  position: relative;
}

.post-options-btn {
  background: transparent;
  border: none;
  font-size: 22px;
  font-weight: bold;
  color: #6b7280;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.post-options-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

/* Dropdown menu */
.post-options-menu {
  position: absolute;
  top: 38px;
  right: 0;
  background: #ffffff;
  border-radius: 12px;
  min-width: 180px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 100;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Menu item */
.post-options-item {
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  color: #dc2626;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.post-options-item:hover {
  background: #fee2e2;
}

      `}</style>
    </>
  );
};

export default PostProfile;
