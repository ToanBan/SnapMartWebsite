"use client";
import React, { useState } from "react";
import Image from "next/image";
import PostCreator from "./PostCreator";
import { MoreHorizontal, X } from "lucide-react";
import dayjs from "dayjs";
import ConfirmRemove from "./share/ConfirmRemove";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
import { useRouter } from "next/navigation";
import { getMediaUrl } from "@/lib/mediaUrl";
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
}

const mediaUrl = (fileName: string) => getMediaUrl(fileName);

const DisplayEditPost = ({
  postEdit,
  onClose,
  isUpdate,
}: {
  postEdit: PostProps | null;
  onClose: () => void;
  isUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [mediaPost, setMediaPost] = useState(postEdit?.post_url);

  if (!postEdit) return null;
  const handleClearMedia = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMediaPost("");
  };

  return (
    <>
      <div
        className="modal d-block"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow-lg border-0">
            <div className="modal-header border-bottom-0 pb-3">
              <h5
                className="modal-title fw-bolder"
                style={{
                  background: "linear-gradient(to right, #8b5cf6, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "2rem",
                }}
              >
                Chỉnh sửa bài đăng
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            <form
              onSubmit={(e) => {
                isUpdate(e), onClose();
              }}
            >
              <div className="modal-body py-4">
                <div className="mb-4">
                  <label
                    htmlFor="postTitle"
                    className="form-label fw-bold text-secondary"
                  >
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-3 border-secondary"
                    id="post_title"
                    name="post_title"
                    defaultValue={postEdit?.post_caption}
                    placeholder="Nhập tiêu đề bài đăng"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="postMedia"
                    className="form-label fw-bold text-secondary"
                  >
                    Hình ảnh / Video
                  </label>
                  {mediaPost && postEdit.type !== "none" ? (
                    <div className="position-relative">
                      {postEdit?.type === "image" ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "400px",
                          }}
                        >
                          <Image
                            src={mediaUrl(mediaPost)}
                            alt="image_post"
                            fill
                            className="img-fluid rounded-3 shadow-sm object-cover media_post"
                            defaultValue={`${postEdit.post_url}`}
                          />
                        </div>
                      ) : (
                        <video
                          src={mediaUrl(mediaPost)}
                          controls
                          className="img-fluid rounded-3 shadow-sm media_post"
                          defaultValue={`${postEdit.post_url}`}
                        />
                      )}
                      <button
                        onClick={handleClearMedia}
                        className="btn btn-dark rounded-circle position-absolute top-0 end-0 m-2"
                        aria-label="Xóa file media"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      className="form-control form-control-lg rounded-3 border-secondary"
                      id="file_path"
                      name="file_path"
                      placeholder="Dán đường link hình ảnh hoặc video tại đây"
                    />
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill me-2"
                    onClick={onClose}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn text-white rounded-pill shadow-sm"
                    style={{
                      background: "linear-gradient(to right, #8b5cf6, #4f46e5)",
                    }}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const Posts = ({
  posts,
  postCreator,
}: {
  posts: PostProps[] | null;
  postCreator: boolean;
}) => {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [postId, setPostId] = useState("");
  const [postsProfile, setPostsProfile] = useState(posts);
  const [postEdit, setPostEdit] = useState<PostProps | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const OpenShowRemove = () => {
    if (showConfirmRemove) {
      setShowConfirmRemove(false);
    }
    setShowConfirmRemove(true);
  };

  const CloseShowRemove = () => {
    setShowConfirmRemove(false);
  };

  const CloseShowEditModal = () => {
    setShowEditModal(false);
  };

  const DeletePost = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (res.ok) {
        setPostsProfile((prev: any) =>
          prev.filter((p: any) => p.id !== postId)
        );
        setMessage("Xóa Bài Viết Thành Công");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setMessage("Xóa Bài Viết Thất Bại");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const EditPost = async (
    postId: string,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setPostsProfile((prev: any) =>
          prev.map((p: any) =>
            p.id === postId ? { ...p, ...data.message } : p
          )
        );
        setMessage("Chỉnh Sửa Bài Viết Thành Công");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setMessage("Chỉnh Sửa Bài Viết Thất Bại");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <>
      <div
        className="container-fluid d-flex"
        style={{
          flexFlow: "column",
          alignItems: "center",
          gap: "20px",
          marginTop: "8rem",
        }}
      >
        {postCreator && <PostCreator />}

        {postsProfile &&
          postsProfile.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="d-flex align-items-center justify-content-between post-header">
                <div className="d-flex align-items-center">
                  <Image
                    className="rounded-circle me-3 user-avatar"
                    alt="avatar"
                    width={50}
                    height={50}
                    src={
                      post.user.avatar
                        ? getMediaUrl(post.user.avatar)
                        : "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
                    }
                  />
                  <div>
                    <h5 className="username">{post.user.username}</h5>
                    <small className="post-time">
                      {dayjs(post.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </small>
                  </div>
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-light btn-sm"
                    type="button"
                    id={`dropdownMenu-${post.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby={`dropdownMenu-${post.id}`}
                  >
                    <li>
                      <button
                        onClick={() => {
                          setPostEdit(post);
                          setPostId(post.id);
                          setShowEditModal(true);
                        }}
                        className="dropdown-item"
                      >
                        ✏️ Edit
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          OpenShowRemove();
                          setPostId(post.id);
                        }}
                        className="dropdown-item text-danger"
                      >
                        🗑 Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="post-media-content">
                {post.type === "image" && post.post_url && (
                  <Image
                    className="img-fluid post-media"
                    alt="image_post"
                    width={600}
                    height={400}
                    src={mediaUrl(post.post_url)}
                  />
                )}

                {post.type === "video" && post.post_url && (
                  <video
                    className="img-fluid post-media"
                    controls
                    width={600}
                    height={400}
                  >
                    <source src={mediaUrl(post.post_url)} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                  </video>
                )}
              </div>

              {/* Caption */}
              <div className="post-caption">
                <p className="caption-text">
                  <span className="caption-username">{post.user.username}</span>{" "}
                  {post.post_caption}
                </p>
              </div>

              <div className="post-footer">
                <div className="d-flex justify-content-between align-items-center interaction-stats">
                  <small>
                    <i className="bi bi-heart-fill text-danger me-1"></i> 1.5K
                    Lượt Thích
                  </small>
                  <small>120 Bình Luận &bull; 80 Chia Sẻ</small>
                </div>
                <div className="d-flex justify-content-around align-items-center border-top pt-3 interaction-buttons">
                  <button className="btn btn-light btn-sm btn-like">
                    <i className="bi bi-heart me-1"></i> Thích
                  </button>
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

      {showConfirmRemove && (
        <ConfirmRemove
          isOpen
          onClose={CloseShowRemove}
          isDelete={() => DeletePost(postId)}
          postIdRemove={postId}
        />
      )}

      {success && <AlertSuccess message={message} />}
      {error && <AlertError message={message} />}

      {showEditModal && (
        <DisplayEditPost
          postEdit={postEdit}
          onClose={CloseShowEditModal}
          isUpdate={(e: any) => EditPost(postId, e)}
        />
      )}
    </>
  );
};

export default Posts;
