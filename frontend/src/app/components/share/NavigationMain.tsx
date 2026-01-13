"use client";

import React, { useEffect, useState } from "react";
import LoginPartial from "./LoginPartial";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ShopCart from "../ShoppingCart";
import DisplaySearch from "../Search";
import DisplayNotification from "./Notification";
import Messages from "./Messages";
import DisplayCart from "./Cart";
import GetFriend from "../FriendsChat";
const NavigationMain = ({
  loginPartial,
}: {
  loginPartial: React.ReactNode;
}) => {
  const pathName = usePathname();
  const [messagesCount, setMessagesCount] = useState(2);

  useEffect(() => {
    //@ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light shadow"
        style={{
          position: "fixed",
          width: "100%",
          backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <div className="container-fluid">
          <Image alt="logo-main" width={80} height={80} src={"/SnapMart.png"} />
          <Link
            style={{
              fontWeight: "800",
              fontStyle: "italic",
              color: "cadetblue",
            }}
            href={"/"}
            className="navbar-brand"
          >
            SnapMart
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className={`nav-item`}>
                <Link className="nav-link " href={"/shop"}>
                  SHOP
                </Link>
              </li>
              <li
                className={`nav-item ${
                  pathName === "/about" ? "activeNavigation" : ""
                }`}
              >
                <Link className="nav-link" href={"/about"}>
                  ABOUT
                </Link>
              </li>
            </ul>

            <span className="navbar-text d-flex justify-content-end ms-auto">
              <DisplaySearch />
              <DisplayCart />
              <Messages />
              <DisplayNotification />
              {loginPartial}
            </span>
          </div>
        </div>
      </nav>

      <GetFriend />

      <ShopCart />
    </>
  );
};

export default NavigationMain;
