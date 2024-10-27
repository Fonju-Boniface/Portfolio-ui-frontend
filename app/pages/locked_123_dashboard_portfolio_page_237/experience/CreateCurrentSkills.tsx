"use client"
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

interface Skill {
  id: string;
  title: string;
  SkDescription: string;
  SkCategory: string;
  SkType: string;
  imageUrl?: string;
}

const CreateCurrentSkills = () => {
  const [skillData, setSkillData] = useState<Skill>({
    title: "",
    SkDescription: "",
    SkCategory: "",
    SkType: "",
    imageUrl: "",
  });

  const [Skills, setSkills] = useState<Skill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [currentSkillId, setCurrentSkillId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const storage = getStorage();

  useEffect(() => {
    const skillsRef = ref(database, "MyCurrentSkills");
    onValue(skillsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedSkills = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] } as Skill))
        : [];
      setSkills(loadedSkills);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSkillData({ ...skillData, [name]: value });
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
      let imageUrl = skillData.imageUrl;

      if (imageFile) {
        const imageRef = storageRef(
          storage,
          `MyCurrentSkills/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const updatedSkillData = { ...skillData, imageUrl };
      const skillsRef = ref(database, "MyCurrentSkills");
      if (editMode) {
        await update(
          ref(database, `MyCurrentSkills/${currentSkillId}`),
          updatedSkillData
        );
      } else {
        await push(skillsRef, updatedSkillData);
      }

      resetForm();
    } catch (error) {
      console.error("Error adding/updating current skill:", error);
      setNotification("Failed to add/update current skill.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSkillData({
      title: "",
      SkDescription: "",
      SkCategory: "",
      SkType: "",
      imageUrl: "",
    });
    setImageFile(null);
    setPreviewImage(null);
    setIsDialogOpen(false);
    setEditMode(false);
    setCurrentSkillId(null);
  };

  const openEditDialog = (skill: Skill) => {
    setSkillData(skill);
    setCurrentSkillId(skill.id);
    setIsDialogOpen(true);
    setEditMode(true);
  };

  const openDeleteDialog = (skillId: string) => {
    setCurrentSkillId(skillId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (currentSkillId) {
      try {
        await remove(ref(database, `MyCurrentSkills/${currentSkillId}`));
        setNotification("Current skill deleted successfully.");
      } catch (error) {
        console.error("Error deleting current skill:", error);
        setNotification("Failed to delete current skill.");
      } finally {
        setIsDeleteDialogOpen(false);
        setCurrentSkillId(null);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">My Current Skills</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button variant="outline">Add New Current Skill</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            {editMode ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex justify-between items-center">
              <label htmlFor="imageUrl" className="block font-medium">
                Skill Image
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
                  alt="Skill Image"
                  width={185}
                  height={185}
                  className="rounded-sm w-7 h-7 object-cover absolute right-1"
                />
              )}
            </div>

            <input
              name="title"
              value={skillData.title}
              onChange={handleChange}
              placeholder="Skill Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="SkDescription"
              value={skillData.SkDescription}
              onChange={handleChange}
              placeholder="Skill Description"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="SkCategory"
              value={skillData.SkCategory}
              onChange={handleChange}
              placeholder="Skill Category"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              name="SkType"
              value={skillData.SkType}
              onChange={handleChange}
              placeholder="Skill Type"
              className="w-full p-2 border border-gray-300 rounded"
            />

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
        <h2 className="text-lg font-bold">Existing Current Skills</h2>
        {Skills.length === 0 ? (
          <p>No current skills found.</p>
        ) : (
          Skills.map((skill) => (
            <div key={skill.id} className="border p-4 mb-4 rounded">
              <h3 className="font-bold">
                Skill Name:{" "}
                <b className="text-primary">{skill.title}</b>
              </h3>
              {skill.imageUrl && (
                <Image
                  src={skill.imageUrl}
                  alt="Skill Image"
                  width={200}
                  height={200}
                  className="rounded-md mb-2"
                />
              )}
              <p>
                Skill Category:{" "}
                <b className="text-primary">{skill.SkCategory}</b>
              </p>
              <p>
                Skill Description:{" "}
                <b className="text-primary">{skill.SkDescription}</b>
              </p>
              <p>
                Skill Type: <b className="text-primary">{skill.SkType}</b>
              </p>

              <div className="flex space-x-4 mt-2">
                <Button onClick={() => openEditDialog(skill)} variant="outline">
                  Edit
                </Button>
                <Button
                  onClick={() => openDeleteDialog(skill.id)}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Delete Skill</DialogTitle>
          <p>Are you sure you want to delete this skill?</p>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              className="bg-red-500 text-white hover:bg-red-700 border border-red-700 transition duration-300"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateCurrentSkills;