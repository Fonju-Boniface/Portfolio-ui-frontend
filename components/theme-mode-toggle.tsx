

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex justify-between items-center w-full ">
      {/* Light Mode Button */}
      <div className="flex justify-start align-center w-[50%]">
      <Button
        variant="outline"
        onClick={() => setTheme("light")}
        className={`${theme === "light" ? "bg-gray-200" : ""} w-[5rem]`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      </div>

      {/* Dark Mode Button */}
      <div className="flex justify-end align-center w-[50%]">
      <Button
        variant="outline"
        
        onClick={() => setTheme("dark")}
        className={`${theme === "dark" ? "bg-gray-800 text-white" : ""} w-[5rem]`}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      </div>
    </div>
  );
}
