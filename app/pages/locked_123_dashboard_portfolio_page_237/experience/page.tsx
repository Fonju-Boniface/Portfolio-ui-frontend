"use client";

import React, { useState, useEffect } from "react";
import { database } from "../../../firebase"; // Adjust the path to your Firebase setup
import { ref, set, onValue } from "firebase/database";
import { Button } from "@/components/ui/button"; // Replace with your Shadcn button
import { Input } from "@/components/ui/input"; // Replace with your Shadcn input


const ExperienceSummaryForm = () => {
  const [years, setYears] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [socialMedia, setSocialMedia] = useState<
    { icon: string; link: string; name: string }[]
  >([]);
  const [newSocialMedia, setNewSocialMedia] = useState<{
    icon: string;
    link: string;
    name: string;
  }>({
    icon: "",
    link: "",
    name: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [experienceSummary, setExperienceSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing experience summary from Firebase
  useEffect(() => {
    const experienceRef = ref(database, "experience-summary");

    onValue(experienceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setExperienceSummary(data);
        setYears(data.years || "");
        setDescription(data.description || "");
        setSocialMedia(data.socialMedia || []);
      }
      setIsLoading(false);
    });
  }, []);

  // Handle form submission to update or create the entire experience summary
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add or update the entire experience summary
      const updatedExperienceSummary = {
        years,
        description,
        socialMedia,
      };
      await set(ref(database, "experience-summary"), updatedExperienceSummary);
      alert("Experience Summary saved successfully.");
    } catch (error) {
      console.error("Error saving experience summary:", error);
    }
  };

  // Add new social media link or update an existing one
  const addOrUpdateSocialMedia = () => {
    if (newSocialMedia.icon && newSocialMedia.link && newSocialMedia.name) {
      if (editingIndex !== null) {
        // Update the existing social media link
        const updatedSocialMedia = [...socialMedia];
        updatedSocialMedia[editingIndex] = newSocialMedia;
        setSocialMedia(updatedSocialMedia);
        setEditingIndex(null); // Reset the editing index
      } else {
        // Add a new social media link
        setSocialMedia([...socialMedia, newSocialMedia]);
      }
      setNewSocialMedia({ icon: "", link: "", name: "" });
    } else {
      alert("Please fill in all fields for social media.");
    }
  };

  // Edit an existing social media link
  const editSocialMedia = (index: number) => {
    setNewSocialMedia(socialMedia[index]);
    setEditingIndex(index); // Set the index of the social media being edited
  };

  // Remove a social media link
  const removeSocialMedia = (index: number) => {
    const updatedSocialMedia = socialMedia.filter((_, i) => i !== index);
    setSocialMedia(updatedSocialMedia);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
    <div>
      <h1 className="text-2xl font-bold mb-4 text-primary">Experience Summary</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Years of Experience
          </label>
          <Input
            type="text"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 p-2 border rounded-md"
            required
          />
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold">Social Media Links</h3>
          {socialMedia.length > 0 ? (
            socialMedia.map((media, index) => (
              <div
                key={index}
                className="flex gap-5 mb-2 flex-col flex-wrap items-start border-b border-gray-300  dark:border-neutral-800 p-1 pb-4"
              >

                <div className="flex flex-col gap-2 justify center items-start">

                <span className="flex-1">
                  Icon: <b className="text-primary">{media.icon}</b>{" "}
                </span>
                <span className="flex-1">
                  Link: <b className="text-primary">{media.link}</b>{" "}
                </span>
                <span className="flex-1">
                  Name: <b className="text-primary">{media.name}</b>{" "}
                </span>
                </div>
                <div className="flex gap-1 items-start">
                  <Button
                    type="button"
                    onClick={() => editSocialMedia(index)}
                    className="bg-yellow-500 text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => removeSocialMedia(index)}
                    className="bg-red-500 text-white"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No social media links added yet.</p>
          )}

          {/* Add or Update Social Media Link */}
          <div className="flex md:space-x-2 md:flex-row md:gap-0 gap-3 mt-4 flex-col ">
            <Input
              type="text"
              placeholder="Icon"
              value={newSocialMedia.icon}
              onChange={(e) =>
                setNewSocialMedia({ ...newSocialMedia, icon: e.target.value })
              }
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Link"
              value={newSocialMedia.link}
              onChange={(e) =>
                setNewSocialMedia({ ...newSocialMedia, link: e.target.value })
              }
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Name"
              value={newSocialMedia.name}
              onChange={(e) =>
                setNewSocialMedia({ ...newSocialMedia, name: e.target.value })
              }
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addOrUpdateSocialMedia}
              className="bg-blue-500 text-white"
            >
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>
        </div>

        <Button type="submit" className="bg-green-500 text-white w-full">
          Save Experience Summary
        </Button>
      </form>

      {/* Display Existing Data */}
      {experienceSummary && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Final Result Existing Experience Summary</h2>
          <p className="mt-5">Years of Experience: <b className="text-primary">{experienceSummary.years} </b></p>
          <p>Description: <b className="text-primary"> {experienceSummary.description}</b></p>
          <div className="mt-4 flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Social Media Links</h3>
            {experienceSummary.socialMedia.length > 0 ? (
              experienceSummary.socialMedia.map((media: any, index: number) => (
                <div key={index} className=" mb-2 flex flex-col gap-2">
                  <span className="flex-1">Icon: <b className="text-primary"> {media.icon}</b></span>
                  <span className="flex-1">Link: <b className="text-primary"> {media.link}</b></span>
                  <span className="flex-1">Name: <b className="text-primary"> {media.name}</b></span>
                </div>
              ))
            ) : (
              <p>No social media links found.</p>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ExperienceSummaryForm;
