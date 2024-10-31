"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import Image from "next/image"; // Use the Next.js Image component
import { database } from "../../firebase"; // Adjust the path as needed
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button";

// Define a type for the project data
type Project = {
  id: string;
  projectName: string;
  imageUrl?: string;
  descriptionSummary: string;
  liveLink: string;
  githubLink: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Use the Project type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const projectsRef = ref(database, "MyProjects");

    // Fetch existing projects from Firebase
    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedProjects: Project[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProjects(loadedProjects);
        } else {
          setProjects([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
        setLoading(false);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary">
        My Projects
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center mt-4">
        Explore some of the innovative and creative projects {"I've"} worked on.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300
                text-center justify-between border-b border-gray-300 bg-gradient-to-b
                from-zinc-200 backdrop-blur-2xl dark:border-neutral-800
                dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl
                lg:border lg:bg-gray-200 lg:p-2 lg:dark:bg-zinc-800/30"
            >
              <div className="flex flex-col w-full justify-start items-center gap-[.5rem]">
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt="Project Image"
                    width={300}
                    height={200}
                    className="rounded-md w-full dark:bg-zinc-800/30 h-auto object-cover"
                  />
                )}
                <h2 className="text-xl font-bold mt-4">{project.projectName}</h2>
                <small className="text-sm sm:text-xs mt-2">{project.descriptionSummary}</small>
              </div>
              <div className="flex flex-col w-full justify-center items-center gap-[.1rem]">
                <Link
                  href={`/pages/projects/${project.id}`}
                  className="text-primary mt-4 block font-semibold w-full"
                >
                  <Button
                    variant="outline"
                    className="bg-primary w-full text-secondary flex items-center space-x-2"
                  >
                    Project Details
                  </Button>
                </Link>

                <div className="flex w-full justify-center items-center gap-1">
                  <Link
                    href={project.liveLink}
                    className="text-primary mt-4 block font-semibold w-full"
                  >
                    <Button
                      variant="outline"
                      className="bg-primary w-full text-primary-foreground flex items-center space-x-2"
                    >
                      Live Project
                    </Button>
                  </Link>

                  <Link
                    href={project.githubLink}
                    className="text-primary mt-4 block font-semibold w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full text-secondary-foreground flex items-center space-x-2"
                    >
                      Source Code
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;