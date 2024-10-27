"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase"; // Adjust the path to your Firebase setup

interface SocialMedia {
  icon: string;
  link: string;
  name: string;
}

interface ExperienceSummary {
  years: number;
  description: string;
  socialMedia?: SocialMedia[];
}

const GetExperienceSummary = () => {
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
  if (!experienceSummary) return <p>No experience summary found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Experience Summary</h1>
      <p>Years of Experience: {experienceSummary.years}</p>
      <p>Description: {experienceSummary.description}</p>

      {/* Social Media Links */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Social Media Links</h3>
        {experienceSummary.socialMedia && experienceSummary.socialMedia.length > 0 ? (
          experienceSummary.socialMedia.map((media: SocialMedia, index: number) => (
            <div key={index} className="flex space-x-2 mb-2">
              <span className="flex-1">Icon: {media.icon}</span>
              <span className="flex-1">Link: {media.link}</span>
              <span className="flex-1">Name: {media.name}</span>
            </div>
          ))
        ) : (
          <p>No social media links found.</p>
        )}
      </div>
    </div>
  );
};

export default GetExperienceSummary;