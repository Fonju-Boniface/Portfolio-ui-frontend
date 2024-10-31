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

const Education = () => {
  const [educationData, setEducationData] = useState({
    title: "",
    institution: "",
    startDate: "",
    endDate: "",
    SkType: "",
    SkDescription: "",
    status: "current",
    learnedTags: [] as string[],
    imageUrl: "",
    pdfUrl: "",
  });

  const [Education, setEducation] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [learnedTags, setLearnedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  const [editMode, setEditMode] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState<string | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const storage = getStorage();

  useEffect(() => {
    const educationsRef = ref(database, "MyEducations");
    onValue(educationsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedEducations = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setEducation(loadedEducations);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !learnedTags.includes(tagInput.trim())) {
      setLearnedTags([...learnedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setLearnedTags(learnedTags.filter((t) => t !== tag));
  };

  const handleEdit = (education: any) => {
    setEducationData({
      title: education.title,
      institution: education.institution,
      startDate: education.startDate,
      endDate: education.endDate,
      SkType: education.SkType,
      SkDescription: education.SkDescription,
      status: education.status,
      learnedTags: education.learnedTags || [],
      imageUrl: education.imageUrl || "",
      pdfUrl: education.pdfUrl || "",
    });
    setLearnedTags(education.learnedTags || []);
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
      let pdfUrl = educationData.pdfUrl;

      if (imageFile) {
        const imageRef = storageRef(
          storage,
          `MyEducationsImages/${Date.now()}-${imageFile.name}`,
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (pdfFile) {
        const pdfRef = storageRef(
          storage,
          `MyEducationsPDFs/${Date.now()}-${pdfFile.name}`,
        );
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      const updatedEducationData = {
        ...educationData,
        imageUrl,
        pdfUrl,
        learnedTags,
      };

      const educationsRef = ref(database, "MyEducations");

      if (editMode) {
        await update(
          ref(database, `MyEducations/${currentEducationId}`),
          updatedEducationData,
        );
      } else {
        await push(educationsRef, updatedEducationData);
      }

      resetForm();
    } catch (error) {
      console.error("Error adding/updating Education:", error);
      setNotification("Failed to add/update Education.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEducationData({
      title: "",
      institution: "",
      startDate: "",
      endDate: "",
      SkType: "",
      SkDescription: "",
      status: "current",
      learnedTags: [],
      imageUrl: "",
      pdfUrl: "",
    });
    setImageFile(null);
    setPreviewImage(null);
    setPdfFile(null);
    setTagInput("");
    setLearnedTags([]);
    setIsDialogOpen(false);
    setEditMode(false);
    setCurrentEducationId(null);
  };

  const handleDelete = async () => {
    if (currentEducationId) {
      try {
        await remove(ref(database, `MyEducations/${currentEducationId}`));
        setIsDeleteDialogOpen(false);
        setNotification("Education entry deleted successfully.");
        resetForm();
      } catch (error) {
        console.error("Error deleting education:", error);
        setNotification("Failed to delete education entry.");
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">My Educations</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button variant="outline">Add New Education</Button>
        </DialogTrigger>
        <DialogContent className="h-[80vh]">
          <DialogTitle>
            {editMode ? "Edit Education" : "Add New Education"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 overflow-auto">
            {/* Image Upload */}
            <div className="relative">
              <label htmlFor="imageUrl" className="block font-medium">
                Education Image
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

            {/* PDF Upload */}
            <div>
              <label htmlFor="pdfUrl" className="block font-medium">
                Education PDF
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {educationData.pdfUrl && (
                <a
                  href={educationData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              )}
            </div>

            {/* Other form inputs */}
            <input
              name="title"
              value={educationData.title}
              onChange={handleChange}
              placeholder="Education Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="institution"
              value={educationData.institution}
              onChange={handleChange}
              placeholder="Institution"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            <textarea
              name="SkDescription"
              value={educationData.SkDescription}
              onChange={handleChange}
              placeholder="Education Description"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            {/* Date Pickers */}
            <div className="flex space-x-4">
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={educationData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={educationData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            {/* Type */}

            <input
              name="SkType"
              value={educationData.SkType}
              onChange={handleChange}
              placeholder="Education Type"
              className="w-full p-2 border border-gray-300 rounded"
            />

            {/* Status */}
            <select
              name="status"
              value={educationData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="current">Current</option>
              <option value="past">Past</option>
            </select>

            {/* Learned Tags */}
            <div>
              <label htmlFor="learnedTags" className="block font-medium">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <Button type="button" onClick={addTag}>
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap space-x-2">
                {learnedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold
                      text-gray-700 mb-2"
                  >
                    {tag}{" "}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 ml-2"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button type="submit" variant="default" disabled={submitting}>
              {submitting
                ? "Submitting..."
                : editMode
                  ? "Update Education"
                  : "Add Education"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education List */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        {Education.map((edu) => (
          <div key={edu.id} className="p-4 border rounded">
            <h2 className="text-lg font-semibold">{edu.title}</h2>
            <p>{edu.institution}</p>
            <p>
              {edu.startDate} - {edu.endDate}
            </p>
            <p>{edu.SkDescription}</p>

            {/* Display learned tags */}
            <div className="flex flex-wrap space-x-2">
              {edu.learnedTags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold
                    text-gray-700 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Display image if available */}
            {edu.imageUrl && (
              <div className="mb-2">
                <Image
                  src={edu.imageUrl}
                  alt="Education Image"
                  width={150}
                  height={150}
                  className="rounded-sm"
                />
              </div>
            )}

            {/* Display PDF link if available */}
            {edu.pdfUrl && (
              <div className="mb-2">
                <a
                  href={edu.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Education PDF
                </a>
              </div>
            )}

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
          <p>Are you sure you want to delete this education entry?</p>
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
    </div>
  );
};

export default Education;
