"use client";
import React, { useState } from "react";
import { Video, Image as ImageIcon, Smile, X } from "lucide-react";
import AlertSuccess from "./share/AlertSuccess";
import AlertError from "./share/AlertError";
import { useRouter } from "next/navigation";
const PostCreator = () => {
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const AddPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        form.reset();
        setShowModal(false);
        setIsSubmitting(false);
        setSuccess(true);
        router.refresh();
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="post-card creator-card p-3 p-md-4 w-100">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="creator-avatar">S</div>
          <input
            type="text"
            className="form-control creator-prompt"
            placeholder="Bạn đang nghĩ gì?"
            readOnly
            onClick={() => setShowModal(true)}
          />
        </div>
        <hr />
        <div className="creator-actions d-flex justify-content-around gap-2">
          <button type="button" className="btn creator-action d-flex align-items-center gap-2">
            <Video size={20} className="text-danger" /> Live Video
          </button>
          <button type="button" className="btn creator-action d-flex align-items-center gap-2">
            <ImageIcon size={20} className="text-success" /> Photo/Video
          </button>
          <button type="button" className="btn creator-action d-flex align-items-center gap-2">
            <Smile size={20} className="text-warning" /> Feeling/Activity
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="post-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => !isSubmitting && setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered post-modal-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-content post-modal-content">
              <div className="modal-header post-modal-header d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="modal-title fw-bold">Tạo bài viết</h5>
                  <span className="post-modal-eyebrow">Chia sẻ khoảnh khắc của bạn</span>
                </div>
                <button
                  type="button"
                  className="btn post-modal-close"
                  aria-label="Đóng"
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                >
                  <X />
                </button>
              </div>
              <div className="modal-body post-modal-body">
                <form onSubmit={AddPost}>
                  <div className="post-author-row">
                    <div className="creator-avatar">S</div>
                    <div>
                      <strong>SnapMart user</strong>
                      <small>Đang chia sẻ trên SnapMart</small>
                    </div>
                  </div>
                  <textarea
                    className="form-control post-compose-textarea mb-3"
                    rows={5}
                    placeholder="Chia sẻ điều gì đó với mọi người..."
                    name="post_title"
                  />
                  <div className="post-privacy-row">
                    <span>Ai có thể xem bài viết?</span>
                    <select className="form-select post-compose-input" name="privacy" defaultValue="public">
                      <option value="public">🌍 Công khai</option>
                      <option value="friends">👥 Bạn bè</option>
                    </select>
                  </div>
                  <label className="post-upload-zone mb-3">
                    <ImageIcon size={24} />
                    <span><strong>Thêm ảnh hoặc video</strong><small>Chia sẻ khoảnh khắc của bạn</small></span>
                    <input type="file" className="visually-hidden" name="file_path" />
                  </label>

                  <div className="post-modal-footer d-flex justify-content-end mt-3 gap-3">
                    <button
                      type="button"
                      className="btn post-cancel-btn"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn post-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? "Đang đăng..." : "Post"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && <AlertSuccess message="Thêm Bài Viết Thành Công" />}
      {error && <AlertError message="Thêm Bài Viết Thất Bại" />}

      <style jsx>{`
        .creator-card { border: 1px solid #e5e7eb; background: #fff; box-shadow: 0 10px 28px rgba(15, 23, 42, .06); }
        .creator-avatar { display: grid; width: 42px; height: 42px; flex: 0 0 42px; place-items: center; border-radius: 50%; color: #fff; background: linear-gradient(135deg, #06b6d4, #2563eb); font-weight: 700; }
        .creator-prompt { border: 0; border-radius: 999px; padding: 12px 20px; background: #f1f5f9; cursor: pointer; }
        .creator-prompt:focus { background: #ecfeff; box-shadow: 0 0 0 3px rgba(6, 182, 212, .14); }
        .creator-action { flex: 1; justify-content: center; border-radius: 12px; color: #475569; font-size: .88rem; }
        .creator-action:hover { background: #f0fdfa; color: #0891b2; }
        .post-modal-backdrop { position: fixed; inset: 0; z-index: 1060; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(15, 23, 42, .32); backdrop-filter: blur(4px); }
        .post-modal-dialog { width: 100%; max-width: 540px; margin: 0; animation: zoomIn .25s ease; }
        .post-modal-content { overflow: hidden; border: 0; border-radius: 24px; background: #fff; box-shadow: 0 24px 70px rgba(15, 23, 42, .25); }
        .post-modal-header { padding: 1.35rem 1.5rem; border-bottom: 1px solid #eef2f7; }
        .post-modal-eyebrow { color: #0891b2; font-size: .7rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
        .post-modal-close { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; color: #64748b; background: #f1f5f9; }
        .post-modal-close:hover { color: #0f172a; background: #e2e8f0; }
        .post-modal-body { padding: 1.5rem; }
        .post-author-row { display: flex; align-items: center; gap: .75rem; margin-bottom: 1rem; }
        .post-author-row strong, .post-author-row small { display: block; }
        .post-author-row strong { color: #1e293b; font-size: .92rem; }
        .post-author-row small { margin-top: .15rem; color: #64748b; font-size: .76rem; }
        .post-privacy-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: .75rem; color: #64748b; font-size: .8rem; }
        .post-privacy-row .post-compose-input { width: auto; min-width: 135px; padding: .45rem 2rem .45rem .75rem; font-size: .8rem; }
        .post-compose-textarea, .post-compose-input { border: 1px solid #e2e8f0; border-radius: 14px; background: #f8fafc; }
        .post-compose-textarea { resize: vertical; }
        .post-compose-textarea:focus, .post-compose-input:focus { border-color: #22d3ee; background: #fff; box-shadow: 0 0 0 3px rgba(6, 182, 212, .12); }
        .post-upload-zone { display: flex; align-items: center; gap: .8rem; border: 1px dashed #67e8f9; border-radius: 14px; padding: 1rem; color: #0891b2; background: #ecfeff; cursor: pointer; }
        .post-upload-zone:hover { border-color: #0891b2; background: #cffafe; }
        .post-upload-zone span { display: flex; flex-direction: column; gap: .15rem; }
        .post-upload-zone strong { color: #155e75; font-size: .9rem; }
        .post-upload-zone small { color: #64748b; }
        .post-cancel-btn, .post-submit-btn { min-width: 100px; border-radius: 10px; font-weight: 600; }
        .post-cancel-btn { color: #475569; background: #f1f5f9; }
        .post-submit-btn { color: #fff; background: #06b6d4; box-shadow: 0 8px 18px rgba(6, 182, 212, .22); }
        .post-submit-btn:hover { color: #fff; background: #0891b2; }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (max-width: 576px) {
          .creator-action { padding: .55rem .35rem; font-size: .72rem; }
          .creator-action svg { width: 18px; }
          .post-modal-body { padding: 1rem; }
          .post-privacy-row { align-items: flex-start; flex-direction: column; gap: .4rem; }
          .post-privacy-row .post-compose-input { width: 100%; }
        }
      `}</style>
    </>
  );
};

export default PostCreator;
