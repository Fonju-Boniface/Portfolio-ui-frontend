"use client";
import React from "react";
import Social from "./social";
import Logo from "../../logo";
import Logout from "@/app/pages/auth/logout/page";

const TopNav = () => {
  return (
    <div
      className="hover:shadow-lg transition duration-300 text-center sm:bottom-[-100%] border-b
        border-gray-300 bg-gradient-to-b from-zinc-200 p-1  backdrop-blur-2xl
        dark:border-neutral-800 dark:from-inherit rounded-md lg:border lg:bg-gray-200
        dark:bg-zinc-900 flex justify-between items-center h-[3rem] w-[100%]
        sm:w-[calc(100%-15rem)] z-20 fixed top-0 right-0"
    >
      <div className="">
        <Logo />
      </div>
      <div className="flex justify-center items-center gap-2 ">
        {/* p */}
        <Social />
        <Logout />
      </div>
    </div>
  );
};

export default TopNav;
