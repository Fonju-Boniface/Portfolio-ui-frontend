"use client"
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase"; // Adjust the path to your Firebase setup
import DownResume from "@/app/components/navbars/profile/DownResume";
import { Button } from "@/components/ui/button";

interface SocialMedia {
  link: string;
  icon: string;
  name: string;
}

interface ExperienceSummary {
  description: string;
  socialMedia?: SocialMedia[]; // Optional
}

const Summary = () => {
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
    <>
      <div className="w-full lg:w-[calc(100%-350px)] flex flex-col gap-1">
        <h4 className="font-bold text-left text-primary text-2xl">
          {"What's "}important?
        </h4>
        <br />
        <p className="text-left">{experienceSummary.description}</p>

        {/* Links */}
        <div className="mt-3 flex flex-row items-start justify-start gap-1 flex-wrap w-full">
          <div className="w-full md:w-fit py-1 flex justify-center items-center">
            <DownResume />
          </div>

          {experienceSummary.socialMedia && experienceSummary.socialMedia.length > 0 ? (
            experienceSummary.socialMedia.map((media: SocialMedia, index: number) => (
              <div key={index} className="w-full md:w-fit py-1 flex justify-center items-center">
                <a
                  href={media.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="bg-primary w-full py-1 px-3 text-primary-foreground flex items-center space-x-2"
                    size="icon"
                  >
                    <i className={`${media.icon} text-3xl`}></i>
                    <span>{media.name}</span>
                  </Button>
                </a>
              </div>
            ))
          ) : (
            <p>No social media links found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Summary;

