"use client";

import React, { useState, useEffect } from "react";
import { ref, get, set, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database } from "../../../firebase"; // Adjust path to your firebase config
import { Button } from "@/components/ui/button"; // Shadcn Button
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const DownloadResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const storage = getStorage();

  // Fetch the existing resume file from Firebase on component mount
  useEffect(() => {
    const fetchResume = async () => {
      const resumeRef = ref(database, "Downloadresume/resumeUrl");
      const snapshot = await get(resumeRef);
      if (snapshot.exists()) {
        setResumeUrl(snapshot.val());
      }
    };
    fetchResume();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
    } else {
      alert("Please select a PDF file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!file) {
      alert("No file selected.");
      setSubmitting(false);
      return;
    }

    try {
      const storageRefPath = storageRef(
        storage,
        `resumeFiles/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRefPath, file);
      const downloadURL = await getDownloadURL(storageRefPath);

      // Store the file URL in Firebase Realtime Database
      const resumeRef = ref(database, "Downloadresume");
      await update(resumeRef, { resumeUrl: downloadURL });

      setResumeUrl(downloadURL);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Download Resume</h1>

      {/* Button to trigger file upload dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button variant="outline">Upload/Update Resume</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Upload PDF Resume</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Uploading..." : "Submit"}
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>

      {/* Display the uploaded resume with download and view options */}
      {resumeUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Resume File:</h2>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Resume
          </a>
          <br />
          <a
            href={resumeUrl}
            download
            className="text-blue-500 underline mt-2 block"
          >
            Download Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default DownloadResume;
