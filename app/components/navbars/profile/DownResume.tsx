"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react"; // Import the Download icon from lucide-react
import { Button } from "@/components/ui/button"; // Import the Shadcn Button component
import { ref, get } from "firebase/database";
import { database } from "../../../firebase"; // Adjust the import according to your Firebase config

const DownResume: React.FC = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Fetch the file URL from Firebase Realtime Database
  useEffect(() => {
    const fetchResumeUrl = async () => {
      const resumeRef = ref(database, "Downloadresume/resumeUrl");
      const snapshot = await get(resumeRef);
      if (snapshot.exists()) {
        setFileUrl(snapshot.val() as string); // Store the URL
      } else {
        console.error("No resume URL found in the database");
      }
    };

    fetchResumeUrl();
  }, []);

  const handleDownload = () => {
    if (fileUrl) {
      // Create a link element
      const link = document.createElement("a");
      link.href = fileUrl; // Use the file URL from Firebase
      link.download = "resume.pdf"; // Specify the file name for download
      link.target = "_blank"; // Open in a new tab, but with download
      link.rel = "noopener noreferrer"; // Security: prevent reverse tab-napping
      link.click(); // Trigger the download
    } else {
      alert("Resume not available for download.");
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleDownload}
        variant="outline"
        className="bg-primary w-full text-primary-foreground flex items-center space-x-2"
        disabled={!fileUrl} // Disable button if no file URL is available
      >
        <Download className="w-5 h-5" />
        <span>Download Resume</span>
      </Button>
    </div>
  );
};

export default DownResume;
