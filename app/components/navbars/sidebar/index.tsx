"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Menu,
  Home,
  Contact,
  Star,
  Briefcase,
  User,
  Phone,
  GraduationCap,
  Globe,
} from "lucide-react"; // Import X (close) and Menu (bars) icons
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import Progress from "@/app/pages/test2/ScrollProgressBar/Progress";

// Define an array of links
const links = [
  { href: "/", label: "Home", description: "Hero section", icon: <Home /> },
  {
    href: "/pages/about-me",
    label: "About",
    description: "About me",
    icon: <User />,
  },
  {
    href: "/pages/projects",
    label: "Portfolio",
    description: "My projects",
    icon: <Briefcase />,
  },
  {
    href: "/pages/contact",
    label: "Contact",
    description: "Get in touch",
    icon: <Phone />,
  },
  {
    href: "/pages/experience",
    label: "Experience",
    description: "Get in touch",
    icon: <Contact />,
  },
  {
    href: "/pages/education",
    label: "Education",
    description: "Get in touch",
    icon: <GraduationCap />,
  },
  {
    href: "/pages/reviews",
    label: "Reviews",
    description: "Get in touch",
    icon: <Star />,
  },
  // { href: "/pages/gallery", label: "Gallery", description: "Get in touch", icon: <Image  /> },
  {
    href: "/pages/socialsMedia",
    label: "Globe",
    description: "Get in touch",
    icon: <Globe />,
  },
  // {
  //   href: "/pages/blog",
  //   label: "Blog ",
  //   description: "Get in touch",
  //   icon: <FileText />,
  // },
  // {
  //   href: "/pages/settings",
  //   label: "Settings",
  //   description: "Get in touch",
  //   icon: <Settings />,
  // },
];

const SideBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  // const [isVisibleT, setIsVisibleS] = useState(true);
  const pathname = usePathname(); // Get the current pathname using Next.js' usePathname

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Function to check if the current path is active
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div
        className={`h-full flex justify-center items-end transition-all pb-[3rem] sm:pb-0
        ${isVisible ? "w-[15rem]" : "w-[3rem]"}`}
      >
        {/* Sidebar toggler */}
        <div
          className="flex justify-center items-center h-[3rem] w-[100%] absolute top-0 pb-1"
          onClick={toggleVisibility}
        >
          <Button variant="outline" size="icon" className="relative">
            {isVisible ? (
              <X
                className="h-[1.2rem] w-[1.2rem] rotate-90 scale-100 transition-all duration-300
                  dark:-rotate-0 dark:scale-100"
              />
            ) : (
              <Menu
                className="h-[1.2rem] w-[1.2rem] scale-100 transition-all duration-300 dark:-rotate-0
                  dark:scale-100"
              />
            )}
          </Button>
          {isVisible && (
            <div className="w-[calc(15rem-3rem)] pl-5 text-primary">
              Navigation-Bar
            </div>
          )}
        </div>

        {/* Links */}
        <div
          className="flex justify-start items-center flex-col h-[calc(100%-4rem)] overflow-y-auto
            scrollbar-hide"
        >
          {links.map((link, index) => (
            <Link
              href={link.href}
              key={index}
              passHref
              className={`flex justify-center items-end h-[3.5rem] w-[100%] pl-[.2rem] pb-[.2rem]
              transition-all rounded-bl-lg border-l border-b hover:border-primary
              hover:text-primary hover:mb-2 ${
                isActive(link.href)
                  ? "border-primary text-primary mb-2"
                  : "border-secondary"
              }`}
            >
              <Button variant="outline" size="icon" className="relative">
                {link.icon}
              </Button>
              {isVisible && (
                <div
                  className="flex justify-center items-start flex-col w-[calc(15rem-3rem)] pl-5 h-[100%]"
                  onClick={toggleVisibility}
                >
                  <p>{link.label}</p>
                  <small>{link.description}</small>
                </div>
              )}
            </Link>
          ))}
          <div
            className="fixed sm:absolute left-[-100%] bottom-1 sm:left-0 z-[10000] flex justify-center
              items-end h-[3rem] w-[3rem]"
          >
            <Progress />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
