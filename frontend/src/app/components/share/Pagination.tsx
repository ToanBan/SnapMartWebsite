import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  page,
  pathName,
}: {
  page: number;
  pathName: string;
}) => {
  const prevPage = Math.max(page - 1, 1);
  const nextPage = page + 1;

  return (
    <>
      <div className="pagination-container d-flex justify-content-center align-items-center py-4 row">
        <nav aria-label="Product navigation">
          <ul className="pagination-modern">
            <Link
              scroll={true}
              className={`page-link-modern prev-next ${page <= 1 ? "disabled-link" : ""}`}
              href={`${pathName}?page=${prevPage}`}
            >
              <ChevronLeft size={20} />
            </Link>

            <li className="page-item-modern">
              <span className="page-link-modern active">{page}</span>
            </li>

            <Link 
              scroll={true} 
              className="page-link-modern prev-next" 
              href={`${pathName}?page=${nextPage}`}
            >
              <ChevronRight size={20} />
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

        .page-link-modern:hover:not(.active):not(.disabled-link) {
            border-color: var(--primary-color);
            color: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
            background: #f5f3ff;
        }

        .page-link-modern.active {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: #ffffff;
            box-shadow: var(--shadow-active);
            transform: scale(1.05);
            z-index: 2;
        }

        .disabled-link {
            opacity: 0.5;
            pointer-events: none;
            background: #f1f5f9;
        }

        @media (max-width: 768px) {
            .page-link-modern {
                min-width: 38px;
                height: 38px;
                font-size: 0.85rem;
                border-radius: 10px;
            }
        }
      `}</style>
    </>
  );
};

export default Pagination;