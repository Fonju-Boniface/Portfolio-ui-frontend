"use client";

import React, { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import Image from "next/image"; // Import the Next.js Image component
import axios from "axios"; // Import Axios for Cloudinary upload
import { database } from "../../../firebase"; // Adjust the path as needed
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // Import Shadcn dialog components
import GetMyHome from "./GetMyHome";

// Add Cloudinary constants
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const UPLOAD_PRESET = "portfolio-image"; // Ensure this matches the preset you've set in Cloudinary

const MyHome = () => {
  const [profileData, setProfileData] = useState({
    id: "",
    imageUrl: "",
    startName: "",
    endName: "",
    tags: [] as string[], // Initialize tags as an empty array
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog state
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // Store the file to be uploaded
  const [newTag, setNewTag] = useState(""); // State for managing the new tag input

  useEffect(() => {
    const dataRef = ref(database, "MyHome");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setProfileData(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
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

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    const currentTags = profileData.tags || [];

    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      setProfileData((prevData) => ({
        ...prevData,
        tags: [...currentTags, trimmedTag],
      }));
      setNewTag(""); // Clear the input after adding the tag
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const uploadToCloudinary = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url; // Returns the image URL
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      let imageUrl = profileData.imageUrl;

      // If a new image is selected, upload it to Cloudinary
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile); // Upload the new image and get the URL
      } else {
        // If no new image is selected, keep the old one
        imageUrl = profileData.imageUrl;
      }

      const updatedProfileData = { ...profileData, imageUrl };
      const profileRef = ref(database, "MyHome");
      await set(profileRef, updatedProfileData);

      setNotification("Home updated successfully!");
      setImageFile(null); // Reset file input
      setIsDialogOpen(false); // Close the dialog after successful submission
    } catch (error) {
      setNotification("Failed to update Home." + error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">My Home</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Edit Home</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit My Home</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="relative flex justify-between items-center">
              <label htmlFor="imageUrl" className="block font-medium">
                Home Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-100 p-2 border border-gray-300 rounded"
              />
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Profile"
                  width={185}
                  height={185}
                  className="rounded-sm w-7 h-7 object-cover absolute right-1"
                />
              )}
            </div>

            {/* Other form inputs */}
            <input
              name="startName"
              value={profileData.startName}
              onChange={handleChange}
              placeholder="Start Name"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              name="endName"
              value={profileData.endName}
              onChange={handleChange}
              placeholder="End Name"
              className="w-full p-2 border border-gray-300 rounded"
            />

            {/* Tag Input and Preview */}
            <div>
              <label htmlFor="tags" className="block font-medium">
                Add Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={handleTagChange}
                  placeholder="Enter a tag"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add Tag
                </Button>
              </div>

              {/* Tag Preview */}
              <div className="flex flex-wrap gap-2">
                {profileData?.tags?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-primary rounded-md px-3 py-1 m-1 flex items-center justify-between"
                  >
                    <span>{tag}</span>
                    <Button
                      variant="ghost"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-red-500"
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              type="submit"
              className={`bg-primary w-full text-white flex items-center space-x-2 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Home"}
            </Button>

            <DialogClose>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>

      <GetMyHome />

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-md ${notification.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {notification}
        </div>
      )}
    </div>
  );
};

export default MyHome;
