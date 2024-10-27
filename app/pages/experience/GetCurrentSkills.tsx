"use client"; // Ensures client-side rendering for this component

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase"; // Adjust the path based on your firebase config location
import Image from "next/image";

interface CurrentSkill {
  id: string;
  title: string;
  SkDescription: string;
  SkCategory: string;
  SkType: string;
  imageUrl?: string;
}

const GetCurrentSkills = () => {
  const [skills, setSkills] = useState<CurrentSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to MySkills in Firebase
    const skillsRef = ref(database, "MyCurrentSkills");

    // Fetch data from Firebase
    const unsubscribe = onValue(skillsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedSkills = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setSkills(loadedSkills);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  if (loading) {
    return <p className="text-center">Loading skills...</p>;
  }

  if (skills.length === 0) {
    return <p className="text-center">No skills found.</p>;
  }

  return (
    <div className=" mx-auto px-2 py-8 w-full ">
      <h2 className="text-xl text-left font-bold mb-4">Currently Learning...</h2>
      <div
        className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl
          dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit
          lg:w-full rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 p-1 w-full"
      >

<div className="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="flex flex-col rounded-lg shadow-md hover:shadow-lg transition duration-300
                text-center items-center justify-center border-b border-gray-300 bg-gradient-to-b
                from-zinc-200 backdrop-blur-2xl dark:border-neutral-800
                dark:bg-zinc-800/30 dark:from-inherit  lg:rounded-xl
                lg:border lg:bg-gray-200 lg:p-2 lg:dark:bg-zinc-800/30"
            >
              <div className="flex flex-col justify-start items-center  w-[200px]">
                {skill.imageUrl && (
                  <Image
                    src={skill.imageUrl}
                    alt="Project Image"
                    width={50}
                    height={50}
                    className="rounded-md   object-cover"
                  />
                )}
                <h2 className="text-xl font-bold mt-4 text-primary">
                  {skill.title}
                </h2>
                <small className="text-sm sm:text-xs mt-1">
                  {skill.SkCategory}
                </small>
                <small className="text-sm sm:text-xs mt-1">
                  {skill.SkType} working experience
                </small>

                <p className="text-sm sm:text-xs mt-1">
                  {skill.SkDescription}
                </p>
              </div>
            </div>
          ))
        )}
      </div>


        
      </div>
    </div>
  );
};

export default GetCurrentSkills;
