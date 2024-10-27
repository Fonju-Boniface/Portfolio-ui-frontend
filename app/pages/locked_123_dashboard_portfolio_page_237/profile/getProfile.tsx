"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase"; // Adjust the path as needed
import Image from "next/image";

const GetProfile = () => {
  const [profileData, setProfileData] = useState<{
    imageUrl: string;
    name: string;
    profession: string;
    email: string;
    phoneNumber: string;
    location: string;
    address: string;
  } | null>(null);

  useEffect(() => {
    const profileRef = ref(database, "MyProfile");

    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfileData(data);
      }
    });
  }, []);

  if (!profileData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
      <div
        className="flex flex-col justify-center items-start border-b border-gray-300
          bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800
          dark:bg-zinc-800/30 dark:from-inherit lg:static rounded-xl lg:border
          lg:bg-gray-200 lg:dark:bg-zinc-800/30 p-1 w-full sm:w-[300px]"
      >
        {/* Image */}
        {profileData.imageUrl && (
          <div className="w-32 h-32 relative ">
            <Image
              src={profileData.imageUrl}
              alt={profileData.name}
              layout="fill"
              objectFit="contain"
              className="rounded-md w-full"
            />
          </div>
        )}

        {/* Profile Info */}
        <div className="text-left">
          <h2 className="text-xl text-left font-semibold">
            Phone: <b className="text-primary">{profileData.name}</b>
          </h2>
          <p>
            profession: <b className="text-primary">{profileData.profession}</b>
          </p>
          <p>
            Email:
            <b className="text-primary">{profileData.email}</b>
          </p>
          <p>
            Phone: <b className="text-primary">{profileData.phoneNumber}</b>
          </p>
          <p>
            Location:
            <b className="text-primary">{profileData.location}</b>
          </p>
          <p>
            Address:
            <b className="text-primary">{profileData.address}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetProfile;
