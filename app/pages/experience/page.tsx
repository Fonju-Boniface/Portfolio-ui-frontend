"use client";
import React from "react";
import Exp from "./Exp";
import Summary from "./Summary";
import Skills from "./Skills";
import GetCurrentSkills from "./GetCurrentSkills";
const Experience = () => {
  return (
    <>
      <main
        className="min-h-screen w-full flex flex-col items-start text-center justify-start py-24
          sm:px-5 px-1 rounded-lg shadow-md border-b border-gray-300 bg-gradient-to-b
          from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800
          dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl
          lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 gap-20"
      >
        {/*  */}
        <div className="flex items-start text-center justify-start flex-wrap gap-5 w-full ">
          <Exp />
          {/* <Summary Section /> */}

          <Summary />
          {/* <Skills Section /> */}
          <Skills />
          {/* <Currently learning Skills Section /> */}
          <GetCurrentSkills />

          {/* DownResume */}
        </div>
      </main>
    </>
  );
};

export default Experience;
