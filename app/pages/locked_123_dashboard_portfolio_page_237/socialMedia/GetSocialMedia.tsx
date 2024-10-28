"use client"
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../../firebase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the structure of the education data
type Education = {
  id: string;
  title: string;
  institution: string;
  imageUrl?: string; // Optional if not every entry has an image
};

const GetSocialMedia = () => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEducationData = () => {
      const db = getDatabase(app);
      const educationRef = ref(db, "MySocialMedias");

      onValue(educationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const educationArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          })) as Education[]; // Assert that the data is of type Education[]
          setEducationData(educationArray);
        }
        setLoading(false);
      });
    };

    fetchEducationData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Follow Me on Social Media</h2>
      {educationData.length === 0 ? (
        <p className="text-center">No Social Media data found.</p>
      ) : (
        <div className="flex justify-center items-center flex-wrap gap-4 mt-8 w-full">
          {educationData.map((education) => (
            <div
              key={education.id}
              className="mb-8 flex flex-col justify-center items-center relative p-2 rounded-md w-full md:w-[45%]"
            >
              {/* Education Content */}
              <div
                className="p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col
                  items-center justify-between border-b border-gray-300 bg-gradient-to-b
                  from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30
                  dark:from-inherit lg:rounded-md lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30
                  gap-3 w-full h-[250px]"
              >
                {/* Education Image */}
                {education.imageUrl && (
                  <div className="bg-primary p-1 rounded-full flex items-center justify-center w-[100px] h-[100px]">
                    <Image
                      src={education.imageUrl}
                      alt={education.title}
                      width={100}
                      height={100}
                      className="rounded-full object-cover w-[100%] h-[100%]"
                    />
                  </div>
                )}

                <h3 className="text-2xl font-semibold mb-2 text-center">
                  {education.title}
                </h3>

                <Link
                  href={education.institution}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="bg-primary w-full text-primary-foreground flex items-center space-x-2"
                  >
                    Link me
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetSocialMedia;