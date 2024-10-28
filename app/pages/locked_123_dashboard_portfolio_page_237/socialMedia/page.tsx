"use client";

import React, { useState, useEffect } from "react";
import { ref, push, onValue, update, remove } from "firebase/database";
import Image from "next/image";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database } from "../../../firebase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import GetSocialMedia from "./GetSocialMedia";
import Link from "next/link";

// Define a type for the education data
type Education = {
  id: string;
  title: string;
  institution: string;
  imageUrl?: string;
};

const SocialMedia = () => {
  const [educationData, setEducationData] = useState<Omit<Education, 'id'>>({
    title: "",
    institution: "",
    imageUrl: "",
  });

  const [education, setEducation] = useState<Education[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const storage = getStorage();

  useEffect(() => {
    const educationsRef = ref(database, "MySocialMedias");
    onValue(educationsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedEducations = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) as Education[]
        : [];
      setEducation(loadedEducations);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEducationData({ ...educationData, [name]: value });
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

  const handleEdit = (education: Education) => {
    setEducationData({
      title: education.title,
      institution: education.institution,
      imageUrl: education.imageUrl || "",
    });
    setPreviewImage(education.imageUrl || null);
    setCurrentEducationId(education.id);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      let imageUrl = educationData.imageUrl;

      if (imageFile) {
        const imageRef = storageRef(
          storage,
          `MySocialMediasImages/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const updatedEducationData: Education = {
        ...educationData,
        imageUrl,
        id: currentEducationId || "", // Ensure id is present
      };

      const educationsRef = ref(database, "MySocialMedias");

      if (editMode) {
        await update(
          ref(database, `MySocialMedias/${currentEducationId}`),
          updatedEducationData
        );
        setNotification("Social Media updated successfully."); // Set notification
      } else {
        await push(educationsRef, updatedEducationData);
        setNotification("Social Media added successfully."); // Set notification
      }

      resetForm();
    } catch (error) {
      console.error("Error adding/updating My Social Medias:", error);
      setNotification("Failed to add/update My Social Medias.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEducationData({
      title: "",
      institution: "",
      imageUrl: "",
    });
    setImageFile(null);
    setPreviewImage(null);
    setIsDialogOpen(false);
    setEditMode(false);
    setCurrentEducationId(null);
  };

  const handleDelete = async () => {
    if (currentEducationId) {
      try {
        await remove(ref(database, `MySocialMedias/${currentEducationId}`));
        setIsDeleteDialogOpen(false);
        setNotification("My Social Medias entry deleted successfully.");
        resetForm();
      } catch (error) {
        console.error("Error deleting My Social Medias:", error);
        setNotification("Failed to delete My Social Medias entry.");
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">My Social Medias</h1>

      {/* Display Notification */}
      {notification && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
          {notification}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button variant="outline">Add New Social Media</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            {editMode ? "Edit Social Media" : "Add New Social Media"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
            {/* Image Upload */}
            <div className="relative">
              <label htmlFor="imageUrl" className="block font-medium">
                My Social Media Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Education Image"
                  width={185}
                  height={185}
                  className="rounded-sm"
                />
              )}
            </div>

            {/* Other form inputs */}
            <input
              name="title"
              value={educationData.title}
              onChange={handleChange}
              placeholder="Media Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="institution"
              value={educationData.institution}
              onChange={handleChange}
              placeholder="Media Link"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            <Button type="submit" variant="default" disabled={submitting}>
              {submitting
                ? "Submitting..."
                : editMode
                ? "Update Social Media"
                : "Add Social Media"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education List */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        {education.map((edu) => (
          <div key={edu.id} className="p-4 border rounded">
            <h2 className="text-lg font-semibold">{edu.title}</h2>

            {/* Display image if available */}
            {edu.imageUrl && (
              <div className="mb-2">
                <Image
                  src={edu.imageUrl}
                  alt={edu.title}
                  width={150}
                  height={150}
                  className="rounded-sm"
                />
              </div>
            )}
            <Link
              href={edu.institution}
              rel="noopener noreferrer"
              target="_blank"
              className="w-full my-1 mt-4"
            >
              <Button
                variant="outline"
                className="bg-primary w-full text-primary-foreground flex items-center space-x-2"
              >
                Link me
              </Button>
            </Link>
            {/* Edit and Delete buttons */}
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(edu)} variant="outline">
                Edit
              </Button>
              <Button
                onClick={() => {
                  setCurrentEducationId(edu.id);
                  setIsDeleteDialogOpen(true);
                }}
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <p>Are you sure you want to delete this Social Media entry?</p>
          <div className="flex space-x-4 mt-4">
            <Button onClick={handleDelete} variant="destructive">
              Confirm
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <h1>See Social Medias</h1>

      <GetSocialMedia />
    </div>
  );
};

export default SocialMedia;