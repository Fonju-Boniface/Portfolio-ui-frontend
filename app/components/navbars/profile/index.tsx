"use client";
import React, { useState } from "react";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { FullscreenModeToggle } from "@/app/components/navbars/profile/FullscreenModeToggle";
import Me from "./me";
import DownResume from "./DownResume";


const Profile = () => {
 
  return (
    <>
 
      {/* Pro */}
      <Me />
      {/* <div className=" shadow-md mb-1 flex justify-between items-center w-[100%] px-2 relative"> */}
      <div className="w-[100%] flex justify-between items-center flex-col p-1 pb-0">
      <div className=" h-[3rem] w-[100%]">

      <DownResume />
      </div>

      <div className="  h-[3rem] w-[100%]">
        <ThemeColorToggle />
      </div>

      <div className=" h-[3rem] w-[100%]">
        <ThemeModeToggle />
      </div>

      <div className="h-[3rem] w-[100%]">
        <FullscreenModeToggle />
      </div>
      </div>
    
    </>
  );
};

export default Profile;
