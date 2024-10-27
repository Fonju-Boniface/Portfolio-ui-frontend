"use client";

import * as React from "react";
import { Maximize, Minimize } from "lucide-react"; // Import fullscreen icons
import { Button } from "@/components/ui/button";

export function FullscreenModeToggle() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen mode
      document.documentElement.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      });
    } else {
      // Exit fullscreen mode
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="flex justify-center items-center w-full"
      onClick={toggleFullscreen}
    >
      {isFullscreen ? (
        <Minimize className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Maximize className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle fullscreen</span>
    </Button>
  );
}
