"use client";
import React, { useState } from "react";

const ShareButton = ({ postId }: { postId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState("");

  const handleShare = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ postId, caption }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to share post");
      } else {
        setShowModal(false);
        setCaption("");
      }
      console.log("Share post successfully:", data);
    } catch (error) {
      console.error("Error sharing post:", error);
      return;
    }
  };

  return (
    <>
      {/* Nút Share */}
      <button
        className="btn btn-light btn-sm"
        onClick={() => setShowModal(true)}
      >
        <i className="bi bi-share me-1"></i> Chia sẻ
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Chia sẻ bài viết</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Hãy viết gì đó về bài viết này..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary text-white"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary text-white"
                  onClick={handleShare}
                >
                  Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
