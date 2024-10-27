"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // Import the Shadcn Button component
import { Github, Linkedin, Twitter } from "lucide-react"; // Import icons from lucide-react
import { clsx } from "clsx"; // Optional: for conditional class names

// Define an array of social media links
const socialLinks = [
  {
    href: "https://github.com/yourusername",
    icon: <Github className="h-[1.2rem] w-[1.2rem] scale-100 transition-all duration-300 dark:-rotate-0 dark:scale-100" />,
    label: "GitHub"
  },
  {
    href: "https://linkedin.com/in/yourusername",
    icon: <Linkedin className="h-[1.2rem] w-[1.2rem] scale-100 transition-all duration-300 dark:-rotate-0 dark:scale-100"/>,
    label: "LinkedIn"
  },
  {
    href: "https://twitter.com/yourusername",
    icon: <Twitter className="h-[1.2rem] w-[1.2rem] scale-100 transition-all duration-300 dark:-rotate-0 dark:scale-100"/>,
    label: "Twitter"
  }
];

const Social: React.FC = () => {
  return (
    <div className="flex space-1 w-fit">
      {socialLinks.map((link, index) => (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
          className="flex justify-center items-center h-[3rem] w-[3rem]  scale-90 sm:scale-100 "
        >
          <Button variant="outline"
            size="icon" className="relative">
            {link.icon}
           
          </Button>
        </a>
      ))}
    </div>
  );
};

export default Social;
