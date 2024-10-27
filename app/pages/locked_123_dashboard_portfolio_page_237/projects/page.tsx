"use client";

import React, { useState, useEffect } from "react";
import { ref, push, onValue, update, remove } from "firebase/database";
import Image from "next/image"; // Use the Next.js Image component
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database } from "../../../firebase"; // Adjust the path as needed
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // Import Shadcn dialog components

const Projects = () => {
  const [projectData, setProjectData] = useState({
    projectName: "",
    imageUrl: "",
    descriptionSummary: "",
    description: "",
    githubLink: "",
    liveLink: "",
    generalTools: [] as string[],
    frontendTools: [] as string[],
    backendTools: [] as string[],
    researchTools: [] as string[],
    deploymentTools: [] as string[],
  });

  const [projects, setProjects] = useState<any[]>([]); // To store multiple projects
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // Store the file to be uploaded
  const [tagInput, setTagInput] = useState("");
  const [selectedToolGroup, setSelectedToolGroup] = useState<
    | "generalTools"
    | "frontendTools"
    | "backendTools"
    | "researchTools"
    | "deploymentTools"
  >("generalTools");

  const [editMode, setEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const storage = getStorage(); // Firebase storage instance

  useEffect(() => {
    // Fetch existing projects from Firebase
    const projectsRef = ref(database, "MyProjects");
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProjects = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setProjects(loadedProjects);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      let imageUrl = projectData.imageUrl;

      if (imageFile) {
        const imageRef = storageRef(
          storage,
          `projectImages/${Date.now()}-${imageFile.name}`,
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const updatedProjectData = { ...projectData, imageUrl };
      const projectsRef = ref(database, "MyProjects");
      if (editMode) {
        // Update existing project
        await update(
          ref(database, `MyProjects/${currentProjectId}`),
          updatedProjectData,
        );
      } else {
        // Add new project
        await push(projectsRef, updatedProjectData);
      }

      // Resetting state and closing the dialog...
      resetForm();
    } catch (error) {
      console.error("Error adding/updating project:", error);
      setNotification("Failed to add/update project.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setProjectData({
      projectName: "",
      imageUrl: "",
      descriptionSummary: "",
      description: "",
      githubLink: "",
      liveLink: "",
      generalTools: [],
      frontendTools: [],
      backendTools: [],
      researchTools: [],
      deploymentTools: [],
    });
    setImageFile(null);
    setPreviewImage(null);
    setIsDialogOpen(false);
    setEditMode(false);
    setCurrentProjectId(null);
  };

  const addTag = () => {
    if (tagInput && !projectData[selectedToolGroup].includes(tagInput)) {
      setProjectData((prevData) => ({
        ...prevData,
        [selectedToolGroup]: [...prevData[selectedToolGroup], tagInput],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProjectData((prevData) => ({
      ...prevData,
      [selectedToolGroup]: prevData[selectedToolGroup].filter(
        (tag) => tag !== tagToRemove,
      ),
    }));
  };

  const openEditDialog = (project: any) => {
    setProjectData(project);
    setCurrentProjectId(project.id);
    setIsDialogOpen(true);
    setEditMode(true);
  };

  const openDeleteDialog = (projectId: string) => {
    setCurrentProjectId(projectId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (currentProjectId) {
      try {
        await remove(ref(database, `MyProjects/${currentProjectId}`));
        setNotification("Project deleted successfully.");
      } catch (error) {
        console.error("Error deleting project:", error);
        setNotification("Failed to delete project.");
      } finally {
        setIsDeleteDialogOpen(false);
        setCurrentProjectId(null);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">My Projects</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button variant="outline">Add New Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            {editMode ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="relative flex justify-between items-center">
              <label htmlFor="imageUrl" className="block font-medium">
                Project Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-100 p-2 border border-gray-300 rounded"
              />
              {previewImage && (
                <Image
                  src={previewImage} // Replace with your image path
                  alt="Project"
                  width={185} // 12rem = 192px
                  height={185}
                  className="rounded-sm w-7 h-7 object-cover absolute right-1"
                />
              )}
            </div>

            {/* Other form inputs */}
            <input
              name="projectName"
              value={projectData.projectName}
              onChange={handleChange}
              placeholder="Project Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="descriptionSummary"
              value={projectData.descriptionSummary}
              onChange={handleChange}
              placeholder="Description Summary"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="description"
              value={projectData.description}
              onChange={handleChange}
              placeholder="Detailed Description"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="githubLink"
              value={projectData.githubLink}
              onChange={handleChange}
              placeholder="GitHub Link"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              name="liveLink"
              value={projectData.liveLink}
              onChange={handleChange}
              placeholder="Live Project Link"
              className="w-full p-2 border border-gray-300 rounded"
            />

            {/* Tool Group Selection */}
            <div className="flex space-x-2">
              <select
                value={selectedToolGroup}
                onChange={(e) => setSelectedToolGroup(e.target.value as any)}
                className="flex-grow p-2 border border-gray-300 rounded"
              >
                <option value="generalTools">General Tools</option>
                <option value="frontendTools">Frontend Tools</option>
                <option value="backendTools">Backend Tools</option>
                <option value="researchTools">Research Tools</option>
                <option value="deploymentTools">Deployment Tools</option>
              </select>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add Tag"
                className="flex-grow p-2 border border-gray-300 rounded"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>

            {/* Tags Display */}
            <div className="mt-4">
              <h2 className="font-medium">Tags:</h2>
              <div className="flex flex-wrap">
                {projectData[selectedToolGroup].map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500 text-white rounded-full px-3 py-1 m-1 flex items-center
                      justify-between"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>

      {notification && <p className="text-red-500">{notification}</p>}

      <div className="mt-6">
        <h2 className="text-lg font-bold">Existing Projects</h2>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border p-4 mb-4 rounded">
           
              <h3 className="font-bold">project Name: <b className="text-primary">{project.projectName}</b></h3>
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt="Project Image"
                  width={200}
                  height={200}
                  className="rounded-md mb-2"
                />
              )}
              <p>description Summary: <b className="text-primary">{project.descriptionSummary}</b></p>
              <p>description: <b className="text-primary">{project.description}</b></p>
              <p>github Link: <b className="text-primary">{project.githubLink}</b></p>
              <p>live Link: <b className="text-primary">{project.liveLink}</b></p>
              

              {/* Tags Display by Group */}
              <div className="mt-4">
                <h4 className="font-semibold">General Tools:</h4>
                <div className="flex flex-wrap">
                  {Array.isArray(project.generalTools) &&
                  project.generalTools.length > 0 ? (
                    project.generalTools.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      No additional tools were used for this project.
                    </span>
                  )}
                </div>

                <h4 className="font-semibold">Frontend Tools:</h4>
                <div className="flex flex-wrap">
                  {Array.isArray(project.frontendTools) &&
                  project.frontendTools.length > 0 ? (
                    project.frontendTools.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      No Frontend tools were used for this project.
                    </span>
                  )}
                </div>

                {/*  */}
                <h4 className="font-semibold">Backend Tools:</h4>
                <div className="flex flex-wrap">
                  {Array.isArray(project.backendTools) &&
                  project.backendTools.length > 0 ? (
                    project.backendTools.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      No Backend tools were used for this project.
                    </span>
                  )}
                </div>

                {/*  */}
                <h4 className="font-semibold">Research Tools:</h4>
                <div className="flex flex-wrap">
                  {Array.isArray(project.researchTools) &&
                  project.researchTools.length > 0 ? (
                    project.researchTools.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      No Research were made for this project.
                    </span>
                  )}
                </div>

                {/*  */}

                <h4 className="font-semibold">Deployment Tools:</h4>
                <div className="flex flex-wrap">
                  {Array.isArray(project.deploymentTools) &&
                  project.deploymentTools.length > 0 ? (
                    project.deploymentTools.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-500 text-white rounded-full px-2 py-1 m-1"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      this project is not yet deployed.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 mt-2">
                <Button
                  onClick={() => openEditDialog(project)}
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
  onClick={() => openDeleteDialog(project.id)}
  variant="outline"
  className="bg-red-500 text-white hover:bg-red-700 border border-red-700 transition duration-300"
>
  Delete
</Button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Delete Project</DialogTitle>
          <p>Are you sure you want to delete this project?</p>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="danger" className="bg-red-500 text-white hover:bg-red-700 border border-red-700 transition duration-300"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Projects;
