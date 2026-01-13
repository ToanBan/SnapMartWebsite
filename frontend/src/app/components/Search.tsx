"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";

const DisplaySearch = () => {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");

  const RedirectToSearchPage = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(query){
      localStorage.setItem("query", query);
      window.location.href = `/search?query=${query}`
    }
  }

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .modal-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .modal-dialog.full-screen {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          transform: translateY(-20px);
          opacity: 0;
          transition: all 0.4s ease;
        }

        .modal-overlay.show .modal-dialog.full-screen {
          transform: translateY(0);
          opacity: 1;
        }

        .modal-content.full-screen {
          flex: 1;
          border-radius: 0;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .modal-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .input-group {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border-radius: 25px;
          overflow: hidden;
          background: #fff;
          height: 50px;
          max-width: 900px;
          width: 100%;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #333;
        }
      `}</style>

      <button className="nav-link me-2" onClick={() => setShow(true)}>
        <Search size={25} />
      </button>

      <div
        className={`modal-overlay ${show ? "show" : ""}`}
        onClick={() => setShow(false)}
      >
        <div
          className="modal-dialog full-screen"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content full-screen">
            {/* nút đóng */}
            <button className="close-btn" onClick={() => setShow(false)}>
              <X size={28} />
            </button>

            <div className="modal-body">
              <form onSubmit={RedirectToSearchPage} className="d-flex justify-content-center" style={{width:"100%"}}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm Kiếm Bạn Bè"
                    aria-label="Tìm Kiếm Bạn Bè"
                    onChange={(e)=>setQuery(e.target.value)}
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src="https://cdn-icons-png.flaticon.com/128/2811/2811806.png"
                      alt="search"
                      width={28}
                      height={28}
                    />
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplaySearch;
