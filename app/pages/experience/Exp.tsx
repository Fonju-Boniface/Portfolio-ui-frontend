"use client";



import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase"; // Adjust the path to your Firebase setup

interface ExperienceSummary {
  years: number; // Adjust the type based on your actual data
  // Add other properties as needed
}

const Exp = () => {
  const [experienceSummary, setExperienceSummary] = useState<ExperienceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experience summary data from Firebase
  useEffect(() => {
    const experienceRef = ref(database, "experience-summary");

    const unsubscribe = onValue(
      experienceRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setExperienceSummary(data);
        } else {
          setExperienceSummary(null); // Handle no data case
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching experience summary:", error);
        setError("Failed to load experience summary.");
        setIsLoading(false);
      }
    );

    // Clean up the Firebase listener when component unmounts
    return () => unsubscribe();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!experienceSummary) return <p>No years of experience found.</p>;

  return (
    <div
      className="flex w-full justify-center items-center flex-col gap-2 border-b border-gray-300
        bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
        dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
        lg:w-[300px] rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30
        text-3xl uppercase font-bold"
    >
      <p className="text-9xl text-primary">+</p>
      <strong>
        {experienceSummary.years} years <br /> of self-made experience
      </strong>
    </div>
  );
};

export default Exp;