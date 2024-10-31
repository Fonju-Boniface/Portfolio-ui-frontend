'use client'; // Ensure this is at the top of your file

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase"; // Adjust the path as needed
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GithubIcon, Globe } from "lucide-react";
import { useParams } from 'next/navigation'; // Import useParams hook

// Define a type for the project data
type Project = {
  id: string;
  projectName: string;
  imageUrl?: string;
  descriptionSummary: string;
  description: string;
  githubLink: string;
  liveLink: string;
  generalTools?: string[];
  frontendTools?: string[];
  backendTools?: string[];
  researchTools?: string[];
  deploymentTools?: string[];
};

// Define a type for the valid keys of Project
type ProjectKeys = keyof Omit<Project, 'id'>; // Exclude 'id' if you don't need it

const ProjectDetails = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams(); // Use useParams to get the dynamic route parameter

  useEffect(() => {
    if (id) {
      const projectRef = ref(database, `MyProjects/${id}`);

      const unsubscribe = onValue(
        projectRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setProject({ id, ...data });
          } else {
            setError("Project not found.");
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching project details:", error);
          setError("Failed to load project details.");
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [id]);

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!project) return null; // Handle case where project is not found

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{project.projectName}</h1>
      {project.imageUrl && (
        <Image
          src={project.imageUrl}
          alt="Project Image"
          width={400}
          height={400}
          className="rounded-sm w-[100%] h-[auto] object-cover"
        />
      )}
      <div className="flex justify-center items-start flex-col gap-1 my-3 mt-8">
        <p>
          Description Summary:{" "}
          <b className="text-primary">{project.descriptionSummary}</b>
        </p>
        <p>
          Description: <b className="text-primary">{project.description}</b>
        </p>
      </div>

      {/* Tags */}
      <div className="mt-4 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(
          ["generalTools", "frontendTools", "backendTools", "researchTools", "deploymentTools"] as ProjectKeys[]
        ).map((group) => (
          <div
            key={group}
            className="flex flex-col items-start p-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center justify-between border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30"
          >
            <h4 className="font-semibold">
              {group
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              :
            </h4>
            <div className="flex flex-wrap">
              {Array.isArray(project[group]) && project[group].length > 0 ? (
                project[group].map((tag) => (
                  <span key={tag} className="bg-primary rounded-md px-2 py-1 m-1">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">
                  No {group.replace(/([A-Z])/g, " ").toLowerCase()} used for this project.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-start items-center gap-3 my-3 mt-5">
        <Link href={project.githubLink} passHref>
          <Button
            variant="outline"
            className="relative flex justify-start items-center h-[3.5rem] transition-all gap-2"
          >
            <GithubIcon className="text-primary" />
            <h2>Source Code</h2>
          </Button>
        </Link>
        <Link href={project.liveLink} passHref>
          <Button
            variant="outline"
            className="relative flex justify-start items-center h-[3.5rem] transition-all gap-2"
          >
            <Globe className="text-primary" />
            <h2>Live Project</h2>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetails;
