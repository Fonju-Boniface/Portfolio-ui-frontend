"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/router";
import { database } from "../../../../../firebase"; // Adjust the path as needed
import Image from "next/image"; // Use the Next.js Image component

// Define a Project type
interface Project {
  id: string;
  projectName: string;
  imageUrl?: string; // Optional property
  descriptionSummary: string;
  description: string;
  githubLink: string;
  liveLink: string;
  generalTools?: string[];
  frontendTools?: string[];
  backendTools?: string[];
  researchTools?: string[];
  deploymentTools?: string[];
}

const ProjectDetails = () => {
  const [project, setProject] = useState<Project | null>(null); // Store the project details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query; // Get the project ID from the URL

  useEffect(() => {
    if (id) {
      const projectRef = ref(database, `MyProjects/${id}`);
      
      // Fetch the specific project details from Firebase
      const unsubscribe = onValue(projectRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProject({ id, ...data } as Project); // Cast to Project type
        } else {
          setError("Project not found.");
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching project details:", error);
        setError("Failed to load project details.");
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [id]);

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!project) return null; // Handle case where project is not found

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">{project.projectName}</h1>
      {project.imageUrl && (
        <Image
          src={project.imageUrl}
          alt="Project Image"
          width={400}
          height={400}
          className="rounded-md mb-2"
        />
      )}
      <p>
        Description Summary: <b className="text-primary">{project.descriptionSummary}</b>
      </p>
      <p>
        Description: <b className="text-primary">{project.description}</b>
      </p>
      <p>
        GitHub Link: <b className="text-primary">{project.githubLink}</b>
      </p>
      <p>
        Live Link: <b className="text-primary">{project.liveLink}</b>
      </p>
      {/* Tags Display by Group */}
      <div className="mt-4">
        {["generalTools", "frontendTools", "backendTools", "researchTools", "deploymentTools"].map((group) => (
          <div key={group}>
            <h4 className="font-semibold">{group.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</h4>
            <div className="flex flex-wrap">
              {Array.isArray(project[group]) && project[group].length > 0 ? (
                project[group].map((tag) => (
                  <span key={tag} className="bg-blue-500 text-white rounded-full px-2 py-1 m-1">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">
                  No {group.replace(/([A-Z])/g, ' $1').toLowerCase()} used for this project.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;