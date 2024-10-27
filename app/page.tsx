"use client";

// import Dialog from "./Dialog";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import Image from "next/image";
import { database } from "./firebase"; // Adjust the path as needed

export default function Home() {
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
    <div className=" flex justify-center items-center min-h-screen ">
      {/* bg-red-800 */}

      <div className="  flex flex-col justify-center items-center px-1 md:px-4 lg:px-16">
        {profileData.imageUrl && (
          <div className="w-32 h-32 p-1 outline-dashed outline-3 rounded-full outline-primary relative">
            <Image
              src={profileData.imageUrl}
              alt={profileData.startName}
              width={150}
              height={150}
              className=""
            />
          </div>
        )}

        <small className="mt-8 font-bold text-sm sm:text-base md:text-lg">
          Welc<b className="text-primary">ome </b>
        </small>
        <div className="flex justify-center items-center gap-2 flex-wrap mt-4 text-center">
          <h3
            className="flex-none text-center mt-1 font-bold text-4xl sm:text-5xl md:text-6xl
              lg:text-8xl uppercase"
          >
            {profileData.startName}{" "}
            <b className="text-primary">{profileData.endName}</b>
          </h3>

          <div
            className="flex flex-col justify-center items-center border-b border-gray-300
              bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:w-full
              rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 text-primary
              p-1"
          >
            {profileData.tags && profileData.tags.length > 0 ? (
              profileData.tags.map((tag, index) => (
                <li
                  key={index}
                  className="text-sm text-center w-full sm:text-sm md:text-base"
                >
                  {tag}
                </li>
              ))
            ) : (
              <p>No tags available.</p>
            )}
          </div>
        </div>
      
      </div>
    </div>
  );
}
