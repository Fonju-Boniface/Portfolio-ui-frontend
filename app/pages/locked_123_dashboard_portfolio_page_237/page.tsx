"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import AboutText from "./about/abouttext/page";
import AboutHobbies from "./about/abouthobbies/page";
import AboutMission from "./about/aboutmission/page";
import MyProfile from "./profile/page";
import GetContact from "./getcontact/page";
import Projects from "./projects/page";
import ExperienceSummaryForm from "./experience/page";
import CreateSkills from "./experience/CreateSkills";
import CreateCurrentSkills from "./experience/CreateCurrentSkills";
import DownloadResume from "./downloadResume/DownloadResume";
import MyHome from "./home/page";
import DVLottery from "./dv/DVLottery";
import SocialMedia from "./socialMedia/page";
import { ChevronRight } from "lucide-react";
import GetRating from "./rating/GetRating";

const tabContents = [
  { title: "Hobbies", content: <AboutHobbies /> },
  { title: "Mission & Vision", content: <AboutMission /> },
  { title: "About Text", content: <AboutText /> },
  { title: "Profile", content: <MyProfile /> },
  { title: "Contact", content: <GetContact /> },
  { title: "Projects", content: <Projects /> },
  { title: "Experience Summary", content: <ExperienceSummaryForm /> },
  { title: "Create Skills", content: <CreateSkills /> },
  { title: "Current Skills", content: <CreateCurrentSkills /> },
  { title: "Download Resume", content: <DownloadResume /> },
  { title: "My Home", content: <MyHome /> },
  { title: "DV Lottery", content: <DVLottery /> },
  { title: "Social Media", content: <SocialMedia /> },
  { title: "Get Rating", content: <GetRating /> },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleTabClick = (index: number) => {
    setIsVisible(!isVisible);
    setActiveTab(index);
  };

  return (
    <div className="relative">
      <div
        className={`mb-4 w-full h-full ${isVisible && "w-[calc(100%-200px)]"}`}
      >
        <h1 className="text-3xl text-center font-bold mb-4 uppercase">
          Dashboard
        </h1>
        <div id="TopOf_Nav" className="p-1 sm:p-6">
          {tabContents[activeTab].content}
        </div>
      </div>

      <div
        className={`w-[200px] h-[calc(100vh-3rem)] fixed bottom-0 right-0 dark:bg-zinc-900
        bg-zinc-100 transition-all p-1 ${
          !isVisible ? "rounded-tl-lg right-[-200px]" : ""
        }`}
      >
        <Button
          variant="outline"
          className={`w-full ${
            !isVisible
              ? `absolute left-[-3.5rem] top-0 w-[3rem] h-[3rem] rounded-none rounded-tl-lg
            rounded-bl-lg`
              : "sticky top-0"
          }`}
          onClick={toggleVisibility}
        >
          <ChevronRight
            className={`h-[1.2rem] w-[1.2rem] ${!isVisible && "rotate-180"} transition-all duration-500`}
          />
        </Button>
        <div
          className={`flex justify-start items-center flex-col h-[calc(100vh-6rem)] w-full overflow-y-auto pt-4
          ${isVisible}`}
        >
          {tabContents.map((tab, index) => (
            <a href="#TopOf_Nav" key={index} className="mb-2 w-full">
              <Button
                variant={activeTab === index ? "secondary" : "outline"} // Changed "primary" to "secondary"
                className="w-full"
                onClick={() => handleTabClick(index)}
              >
                {tab.title}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
