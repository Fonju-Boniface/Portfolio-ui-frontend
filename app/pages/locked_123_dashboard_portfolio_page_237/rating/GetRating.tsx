"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import ReactStars from "react-rating-stars-component";
import { ref, push, update, remove, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database } from "../../../firebase";
import toast from "react-hot-toast";
import GetRatingMain from "./GetRatingMain";

type CountryOption = {
  label: string;
  value: string;
  flag: string;
  code: string; // Telephone code
};

interface Rating {
  id?: string;
  name: string;
  email: string;
  phone: {
    countryCode: string;
    phoneNumber: string | undefined;
    countryFlag: string;
  };
  profession: string;
  website?: string;
  description?: string;
  myContribution?: string;
  rating: number;
  review: string;
  imageUrl?: string;
}

const GetRating = () => {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [myContribution, setMyContribution] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingToDelete, setRatingToDelete] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [ratingToUpdate, setRatingToUpdate] = useState<Rating | null>(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryData = response.data.map((country: any) => ({
          label: `${country.flag} ${country.name.common}`,
          value: country.cca2,
          flag: country.flag,
          code:
            country.idd.root +
            (country.idd.suffixes ? country.idd.suffixes[0] : ""),
        }));
        setCountries(countryData);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    const ratingsRef = ref(database, "ratings");
    onValue(ratingsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRatings = data
        ? Object.entries(data).map(([id, rating]) => ({ id, ...rating })) as Rating[]
        : [];
      setRatings(loadedRatings);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "";
      if (imageFile) {
        const storage = getStorage();
        const storageReference = storageRef(storage, `ratings/${imageFile.name}`);
        await uploadBytes(storageReference, imageFile);
        url = await getDownloadURL(storageReference);
      }

      const formData: Rating = {
        name,
        email,
        phone: {
          countryCode: selectedCountry?.code || "",
          phoneNumber,
          countryFlag: selectedCountry?.flag || "",
        },
        profession,
        website,
        description,
        myContribution,
        rating,
        review,
        imageUrl: url,
      };

      const ratingsRef = ref(database, "ratings");
      await push(ratingsRef, formData);
      toast.success("Rating submitted successfully!");
      setIsUpdateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setProfession("");
    setWebsite("");
    setDescription("");
    setMyContribution("");
    setRating(0);
    setReview("");
    setImageFile(null);
    setImageUrl("");
    setSelectedCountry(null);
  };

  const handleDeleteRating = async () => {
    if (ratingToDelete) {
      try {
        const ratingRef = ref(database, `ratings/${ratingToDelete}`);
        await remove(ratingRef);
        toast.success("Rating deleted successfully!");
      } catch (error) {
        console.error("Error deleting rating:", error);
        toast.error("Failed to delete rating!");
      } finally {
        setIsDeleteDialogOpen(false);
        setRatingToDelete(null);
      }
    }
  };

  const handleUpdateRating = async () => {
    if (ratingToUpdate) {
      try {
        const ratingRef = ref(database, `ratings/${ratingToUpdate.id}`);
        const updatedData = {
          name,
          email,
          phone: {
            countryCode: selectedCountry?.code || "",
            phoneNumber,
            countryFlag: selectedCountry?.flag || "",
          },
          profession,
          website,
          description,
          myContribution,
          rating,
          review,
          imageUrl: imageUrl || ratingToUpdate.imageUrl,
        };

        await update(ratingRef, updatedData);
        toast.success("Rating updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Error updating rating:", error);
        toast.error("Failed to update rating!");
      } finally {
        setIsUpdateDialogOpen(false);
        setRatingToUpdate(null);
      }
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center w-full">
      <Button onClick={() => setIsUpdateDialogOpen(true)} className="mb-4 ">
        Add Rating
      </Button>
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="h-[80vh]">
          <DialogTitle>
            {ratingToUpdate ? "Update Rating" : "Rating Submission"}
          </DialogTitle>
          <DialogDescription>
            Submit your rating and review below:
          </DialogDescription>
          <form
            onSubmit={ratingToUpdate ? handleUpdateRating : handleSubmit}
            className="space-y-4 overflow-auto"
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block font-medium">
                Phone Number
              </label>
              <Select
                options={countries}
                onChange={(value) => setSelectedCountry(value as CountryOption)}
                className="mb-4"
                placeholder="Select country"
              />
              {selectedCountry && (
                <PhoneInput
                  international
                  country={selectedCountry.value}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry={selectedCountry.value}
                  className="border p-2 w-full"
                />
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="profession" className="block font-medium">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="block font-medium">
                Website
              </label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="myContribution" className="block font-medium">
                My Contribution
              </label>
              <textarea
                id="myContribution"
                value={myContribution}
                onChange={(e) => setMyContribution(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rating" className="block font-medium">
                Rating
              </label>
              <ReactStars
                count={5}
                onChange={(newRating) => setRating(newRating)}
                size={24}
                activeColor="#ffd700"
                value={rating}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="review" className="block font-medium">
                Review
              </label>
              <select
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="border p-2 w-full"
              >
                <option value="Good Portfolio">Good Portfolio</option>
                <option value="Nice">Nice</option>
                <option value="Great Job">Great Job</option>
                <option value="Worst Stuff">Worst Stuff</option>
                <option value="I Love It">I Love It</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block font-medium">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 w-full"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this rating?
          </DialogDescription>
          <DialogFooter>
            <Button type="button" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleDeleteRating}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GetRatingMain />
    </div>
  );
};

export default GetRating;