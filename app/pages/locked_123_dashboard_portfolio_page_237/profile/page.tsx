"use client";

import React, { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import Image from "next/image";
import axios from "axios";
import { database } from "../../../firebase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import GetProfile from "./getProfile";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "portfolio-image"; // Replace with your Cloudinary preset

const ProfileImage = () => {
  const [profileData, setProfileData] = useState({
    id: "",
    imageUrl: "",
    name: "",
    profession: "",
    email: "",
    phoneNumber: "",
    location: "",
    address: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const dataRef = ref(database, "MyProfile");
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

  const uploadToCloudinary = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url; // Returns the URL of the uploaded image
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      let imageUrl = profileData.imageUrl;

      // If a new image file is selected, upload it to Cloudinary
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const updatedProfileData = { ...profileData, imageUrl };
      const profileRef = ref(database, "MyProfile");
      await set(profileRef, updatedProfileData);

      setNotification("Profile updated successfully!");
      setImageFile(null); // Reset file input
      setIsDialogOpen(false); // Close dialog after successful submission
    } catch (error) {
      setNotification("Failed to update profile: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit My Profile</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex justify-between items-center">
              <label htmlFor="imageUrl" className="block font-medium">Profile Image</label>
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
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              name="profession"
              value={profileData.profession}
              onChange={handleChange}
              placeholder="Profession"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              name="location"
              value={profileData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              name="address"
              value={profileData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border border-gray-300 rounded"
            />

            <Button
              variant="outline"
              type="submit"
              className={`bg-primary w-full text-white flex items-center space-x-2 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Profile"}
            </Button>

            <DialogClose>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>

      <GetProfile />

      {notification && (
        <div className={`p-4 rounded-md ${notification.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
