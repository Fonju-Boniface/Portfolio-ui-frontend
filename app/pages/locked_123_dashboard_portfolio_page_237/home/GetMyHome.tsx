"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase"; // Adjust the path as needed
import Image from "next/image";

const GetMyHome = () => {
  const [profileData, setProfileData] = useState<{
    imageUrl: string;
    startName: string;
    endName: string;
    tags: string[]; // Add tags to the state
  } | null>(null);

  useEffect(() => {
    const profileRef = ref(database, "MyHome");

    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfileData(data);
      }
    });
  }, []);

  if (!profileData) {
    return <div>Loading Home...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Home Information</h1>
      <div
        className="flex flex-col justify-center items-start border-b border-gray-300
          bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800
          dark:bg-zinc-800/30 dark:from-inherit lg:static rounded-xl lg:border
          lg:bg-gray-200 lg:dark:bg-zinc-800/30 p-1 w-full sm:w-[300px]"
      >
        {/* Image */}
        {profileData.imageUrl && (
          <div className="w-32 h-32 relative">
            <Image
              src={profileData.imageUrl}
              alt={profileData.startName}
              layout="fill"
              objectFit="contain"
              className="rounded-md w-full"
            />
          </div>
        )}

        {/* Profile Info */}
        <div className="text-left">
          <h2 className="text-xl text-left font-semibold">
            First name: <b className="text-primary">{profileData.startName}</b>
          </h2>
          <p>
            Last Name: <b className="text-primary">{profileData.endName}</b>
          </p>
        </div>

        {/* Display Tags */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.tags && profileData.tags.length > 0 ? (
              profileData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p>No tags available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetMyHome;
