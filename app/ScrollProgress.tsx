"use client";

import { useState, useEffect } from "react";

const ScrollProgress: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  // const [isAtTop, setIsAtTop] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.pageYOffset;

      const percentScrolled = (scrollPosition / scrollHeight) * 100;
      setScrollPercentage(percentScrolled);

      // Uncomment this if you plan to use isAtTop in the future
      // setIsAtTop(scrollPosition === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Horizontal Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[.1rem]  z-50">
        <div
          className="h-full bg-primary"
          style={{ width: `${scrollPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScrollProgress;
