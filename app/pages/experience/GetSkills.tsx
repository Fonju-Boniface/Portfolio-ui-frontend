"use client"; // Ensures client-side rendering for this component

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase"; // Adjust the path based on your firebase config location
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming you are using Shadcn's button component
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Import Shadcn dialog components
import { Eye } from "lucide-react";

interface Skill {
  id: string;
  title: string;
  SkDescription: string;
  SkCategory: string;
  SkType: string;
  SkPercentage: number;
  SkYears: string;
  imageUrl?: string;
}

const GetSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null); // To store the skill selected for the dialog

  useEffect(() => {
    // Reference to MySkills in Firebase
    const skillsRef = ref(database, "MySkills");

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
    <div className="w-full relative ">
      <h2 className="text-xl text-left font-bold mb-4">My Skills</h2>
      <div
        className="border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl
          dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
          lg:w-full rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 grid
          gap-8 sm:grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-1"
      >
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300
              text-center justify-between border-b border-gray-300 bg-gradient-to-b gap-2
              from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30
              dark:from-inherit lg:static lg:rounded-xl lg:border lg:bg-gray-200
              lg:dark:bg-zinc-800/30 sm:w-[100%] cursor-pointer"
          >
            <div>
              {/*  */}
              <div className="flex justify-between items-end gap-2">
                <div className="flex flex-col justify-center items-start ">
                  {skill.imageUrl && (
                    <Image
                      src={skill.imageUrl}
                      alt={skill.title}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  )}
                  <small className="font-bold text-left">{skill.title}</small>
                </div>

                <div className="flex flex-col justify-center items-end h-[100%]">
                  {/* <Image src={item.image} alt={item.title} width={50} height={50} className="rounded" /> */}

                  {/* Shadcn Dialog Trigger for Learn More */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative"
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <Eye
                          className="h-[1.2rem] w-[1.2rem] scale-100 transition-all duration-300 dark:-rotate-0
                            dark:scale-100"
                        />
                      </Button>
                    </DialogTrigger>

                    {/* Dialog Content */}
                    {selectedSkill && (
                      <DialogContent
                        className="h-[75vh] w-full sm:w-[400px] bg-gradient-to-b dark:bg-zinc-800/30
                          dark:from-inherit rounded-xl lg:border lg:dark:bg-zinc-800/30 overflow-auto"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold mb-1">
                            {selectedSkill.title}
                          </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          {selectedSkill.imageUrl && (
                            <Image
                              src={selectedSkill.imageUrl}
                              alt={selectedSkill.title}
                              width={300}
                              height={300}
                              className="rounded object-cover w-full"
                            />
                          )}

                          <p className="mt-3">{selectedSkill.SkDescription}</p>
                          <h1 className="font-bold my-3 text-primary text-2xl underline">
                            Specifications
                          </h1>

                          <ul>
                            <li className="">
                              <b className="text-primary">*</b> Experience %:{" "}
                              <b className="text-primary">
                                {selectedSkill.SkPercentage}/100
                              </b>
                            </li>
                            <li className="">
                              <b className="text-primary">*</b> Years of
                              experience:{" "}
                              <b className="text-primary">
                                {selectedSkill.SkYears}
                              </b>
                            </li>
                            <li className="">
                              <b className="text-primary">*</b> Experience Type:{" "}
                              <b className="text-primary">
                                {selectedSkill.SkType}
                              </b>
                            </li>
                            {/* <li className=''><b className='text-primary'>*</b>  Proficiency: <b className='text-primary'>{note}</b></li> */}
                            <li className="">
                              <b className="text-primary">*</b> Category:{" "}
                              <b className="text-primary">
                                {selectedSkill.SkCategory}
                              </b>
                            </li>
                          </ul>
                        </DialogDescription>
                        <DialogFooter>
                          <Button className="w-full mt-1 p-1 bg-primary text-white rounded ">
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>

                  <small className="text-right">
                    <b className="text-primary">{skill.SkYears}Yrs </b>
                    of <b className="text-primary">{skill.SkType} </b>
                    experience{" "}
                  </small>
                </div>
              </div>
              {/*  */}

              <div
                className="flex flex-col rounded-lg shadow-md hover:shadow-lg transition duration-300
                  text-center justify-between border-b bg-gradient-to-b from-zinc-200
                  backdrop-blur-2xl dark:border-neutral-900 dark:bg-zinc-800/30 dark:from-inherit
                  lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200
                  lg:dark:bg-zinc-800/30 p-[.2rem]"
              >
                <div
                  className={`rounded-lg shadow-md flex justify-center items-center bg-primary transition-all
                  text-primary-foreground text-xs ${skill.SkPercentage <= 75 && "bg-yellow-600"}`}
                  style={{ width: `${skill.SkPercentage}%` }}
                >
                  {skill.SkPercentage}%
                </div>
              </div>

              {/*  */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetSkills;
