"use client";
import { useState, useEffect } from "react";
import CircleProgress from "./CircleProgress";

const Progress: React.FC = () => {
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.pageYOffset;
      const percentScrolled = (scrollPosition / scrollHeight) * 100;
      setPercentage(percentScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="">
      <CircleProgress percentage={percentage} circleWidth={41} />
    </div>
  );
};

export default Progress;
