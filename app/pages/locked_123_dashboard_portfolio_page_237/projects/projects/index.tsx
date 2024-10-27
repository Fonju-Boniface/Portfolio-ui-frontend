"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import Image from "next/image"; // Use the Next.js Image component
import { database } from "../../../../firebase"; // Adjust the path as needed
import Link from "next/link"; // Import Link for navigation
const GetProjects = () => {
  const [projects, setProjects] = useState<any[]>([]); // To store multiple projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const projectsRef = ref(database, "MyProjects");
    
    // Fetch existing projects from Firebase
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProjects = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProjects(loadedProjects);
      } else {
        setProjects([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">All Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="border p-4 mb-4 rounded">
            <h3 className="font-bold">
              Project Name: <b className="text-primary">{project.projectName}</b>
            </h3>
            {project.imageUrl && (
              <Image
                src={project.imageUrl}
                alt="Project Image"
                width={200}
                height={200}
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

            <h3 className="font-bold">
  
</h3>

<h3 className="font-bold">
  <Link href={`/projects/${project.id}`} className="text-primary">
    Project Name: <b>{project.projectName}</b>
  </Link>
</h3>

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
        ))
      )}
    </div>
  );
};


export default GetProjects