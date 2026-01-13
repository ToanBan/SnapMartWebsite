import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  page,
  pathName,
}: {
  page: number;
  pathName: string;
}) => {
  return (
    <>
      <div className="pagination-container d-flex justify-content-center align-items-center py-4 row">
        <nav aria-label="Product navigation">
          <ul className="pagination-modern">
            <Link
            scroll={false}
              className="page-item-modern"
              href={`${pathName}${Math.max(page - 1, 1)}`}
            >
              <button
                className="page-link-modern prev-next"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
            </Link>

            <li className="page-item-modern">
              <button className="page-link-modern active">{page}</button>
            </li>

            <Link scroll={false} className="page-item-modern" href={`${pathName}${page + 1}`}>
              <button
                className="page-link-modern prev-next"
                aria-label="Previous page"
              >
                <ChevronRight size={20} />
              </button>
            </Link>
          </ul>
        </nav>
      </div>

      <style>{`
        :root {
            --primary-color: #4f46e5;
            --primary-hover: #4338ca;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --bg-white: #ffffff;
            --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            --shadow-md: 0 10px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
            --shadow-active: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
        }

        .pagination-modern {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
        }

        .page-link-modern {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 44px;
            height: 44px;
            padding: 0 8px;
            border-radius: 12px;
            background: var(--bg-white);
            border: 1px solid #e2e8f0;
            color: var(--text-main);
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-sm);
            text-decoration: none;
        }

        /* Hiệu ứng Hover */
        .page-link-modern:hover:not(.dots):not(.active) {
            border-color: var(--primary-color);
            color: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
            background: #f5f3ff;
        }

        /* Trạng thái Active */
        .page-link-modern.active {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: #ffffff;
            box-shadow: var(--shadow-active);
            transform: scale(1.05);
            z-index: 2;
        }

        /* Nút Previous & Next */
        .page-link-modern.prev-next {
            background: #f8fafc;
            color: var(--text-muted);
        }

        .page-link-modern.prev-next:hover {
            background: var(--bg-white);
            color: var(--primary-color);
        }

        /* Dấu ba chấm */
        .page-link-modern.dots {
            border: none;
            background: transparent;
            box-shadow: none;
            cursor: default;
            color: var(--text-muted);
            min-width: 30px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .pagination-modern {
                gap: 5px;
            }
            .page-link-modern {
                min-width: 38px;
                height: 38px;
                font-size: 0.85rem;
                border-radius: 10px;
            }
        }

        /* Tự động ẩn một số trang trên màn hình rất nhỏ để tránh vỡ giao diện */
        @media (max-width: 480px) {
            .page-item-modern:nth-child(4),
            .page-item-modern:nth-child(5) {
                display: none;
            }
        }
      `}</style>
    </>
  );
};

export default Pagination;
