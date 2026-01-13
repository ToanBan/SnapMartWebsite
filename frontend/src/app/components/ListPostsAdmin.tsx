"use client";
import React, { useEffect, useState } from "react";
import {
  MessageSquareText,
  FileDown,
  Heart,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import dayjs from "dayjs";
import ChangeStatusPost from "../api/admin/ChangeStatusPost";
import Swal from "sweetalert2";
interface PostProps {
  id: string;
  post_url: string;
  post_caption: string;
  shared_post_id: string;
  type: string;
  reactionCount: string;
  createdAt: string;
  report_count: string;
  status: string;
}

const ListPostsAdmin = ({ dataPosts }: { dataPosts: PostProps[] }) => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const renderTypeIcon = (type: any) => {
    switch (type) {
      case "none":
        return <MessageSquareText size={16} className="me-2" />;
      case "share":
        return <Share2 size={16} className="me-2" />;
      case "video":
        return <FileDown size={16} className="me-2" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setPosts(dataPosts);
  }, [dataPosts]);

  const handleChangeStatusPost = async (postId: string, status: string) => {
    if (!postId || !status) return;
    const result = await ChangeStatusPost(postId, status);
    if (result.success && result.data) {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật trạng thái người dùng thành công",
        timer: 1500,
      });

      console.log(result.data);

      setPosts((prev) =>
        prev.map((p) =>
          p.id == result.data.id ? { ...p, status: result.data.status } : p
        )
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: result.message || "Cập nhật trạng thái thất bại",
      });
    }
  };

  return (
    <div className="container-custom py-5">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 fw-bold text-dark">Danh sách bài viết</h1>
          <p className="text-muted mb-0 small">
            Quản lý và theo dõi các nội dung đã đăng tải trên hệ thống
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3">
                  ID
                </th>
                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3">
                  Nội dung
                </th>
                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3">
                  Loại
                </th>
                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3">
                  Tương tác
                </th>

                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3">
                  Trạng Thái
                </th>

                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3">
                  Báo Cáo
                </th>
                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3">
                  Ngày đăng
                </th>

                <th className="border-0 text-uppercase text-muted fw-bold small px-4 py-3 text-end">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="post-row">
                  <td className="px-4">
                    <span className="id-badge">#{post.id}</span>
                  </td>
                  <td className="px-4">
                    <div
                      className="post-caption fw-medium text-dark"
                      title={post.post_caption}
                    >
                      {post.post_caption}
                    </div>
                  </td>
                  <td className="px-4">
                    <span className={`badge-type`}>
                      {renderTypeIcon(post.type)}
                      {post.type}
                    </span>
                  </td>
                  <td className="px-4">
                    <div className="d-flex align-items-center fw-bold text-dark">
                      <Heart
                        size={14}
                        className="text-danger fill-danger me-2"
                        fill="#ef4444"
                      />
                      {post.reactionCount}
                    </div>
                  </td>

                  <td className="px-4">
                    <span className="text-muted small">{post.status}</span>
                  </td>
                  <td className="px-4">
                    <span className="text-muted small">
                      {post.report_count}
                    </span>
                  </td>
                  <td className="px-4">
                    <span className="text-muted small">
                      {dayjs(post.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </td>
                  <td className="px-4 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        onClick={() =>
                          handleChangeStatusPost(post.id, "active")
                        }
                        className="btn-action shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleChangeStatusPost(post.id, "hidden")
                        }
                        className="btn-action shadow-sm text-danger-hover"
                        title="Xóa"
                      >
                        <EyeOff size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .container-custom {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ID Badge */
        .id-badge {
          font-weight: 600;
          color: #4f46e5;
          background-color: #eef2ff;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        /* Type Badges */
        .badge-type {
          padding: 6px 14px;
          border-radius: 50px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
        }
        .badge-text { background-color: #dcfce7; color: #166534; }
        .badge-video { background-color: #fee2e2; color: #991b1b; }
        .badge-file { background-color: #e0f2fe; color: #075985; }

        /* Caption logic */
        .post-caption {
          max-width: 320px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Row hover */
        .post-row {
          transition: background-color 0.2s ease;
        }
        .post-row:hover {
          background-color: #f8fafc;
        }

        /* Custom Action Buttons */
        .btn-action {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
          background-color: #fff;
          color: #64748b;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .btn-action:hover {
          background-color: #4f46e5;
          color: #fff;
          border-color: #4f46e5;
          transform: translateY(-2px);
        }
        .btn-action.text-danger-hover:hover {
          background-color: #ef4444;
          border-color: #ef4444;
        }

        /* Pagination custom */
        .page-link:hover {
          background-color: #e2e8f0 !important;
          color: #000 !important;
        }
        
        @media (max-width: 992px) {
          .post-caption { max-width: 200px; }
        }
      `}</style>
    </div>
  );
};

export default ListPostsAdmin;
