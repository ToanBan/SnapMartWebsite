"use client";
import { Search } from "lucide-react";
import React, { useState } from "react";
const SearchProducts = () => {
  const [query, setQuery] = useState("");

  const handleSearchProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    query.trim();
    window.location.href = `/search/products?query=${query}&page=1`;

  };

  return (
    <>
      <div className="search-container col-12">
        <form onSubmit={handleSearchProduct}>
          <div className="search-wrapper">
            <div className="search-icon">
              <Search size={20} />
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Nhập tên sản phẩm..."
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <Search size={18} className="d-sm-none" />
              <span className="d-none d-sm-inline">Tìm kiếm</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        :root {
            --primary-color: #4f46e5;
            --primary-hover: #4338ca;
            /* Đổ bóng đậm hơn để nổi bật trên nền trắng */
            --shadow-modern: 0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-focus: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .search-container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }

        .search-wrapper {
            position: relative;
            background: #ffffff; /* Màu nền trắng */
            border-radius: 50px;
            padding: 6px 8px 6px 15px;
            /* Đường viền mảnh giúp định hình khối trên nền trắng */
            border: 1px solid #e2e8f0; 
            box-shadow: var(--shadow-modern);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
        }

        /* Hiệu ứng khi nhấn vào ô tìm kiếm */
        .search-wrapper:focus-within {
            border-color: var(--primary-color);
            transform: translateY(-4px); /* Nhô lên cao hơn */
            box-shadow: var(--shadow-focus);
        }

        .search-icon {
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
        }

        .search-wrapper:focus-within .search-icon {
            color: var(--primary-color);
            animation: bounce 0.5s ease;
        }

        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }

        .search-input {
            border: none;
            outline: none;
            background: transparent;
            width: 100%;
            padding: 12px 5px;
            font-size: 1rem;
            font-weight: 500;
            color: #1e293b;
        }

        .search-input::placeholder {
            color: #94a3b8;
        }

        .search-button {
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 40px;
            padding: 12px 28px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);
        }

        .search-button:hover {
            background: var(--primary-hover);
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.5);
            transform: scale(1.05);
        }

        .search-button:active {
            transform: scale(0.95);
        }

        /* Mobile Optimization */
        @media (max-width: 576px) {
            .search-wrapper {
                padding: 5px 5px 5px 15px;
            }
            .search-button {
                padding: 12px;
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }
            .search-input {
                font-size: 0.95rem;
            }
        }
      `}</style>
    </>
  );
};

export default SearchProducts;
