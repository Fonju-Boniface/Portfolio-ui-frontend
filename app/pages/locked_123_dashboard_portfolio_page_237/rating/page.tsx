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
import Rating from "react-rating";
import { ref, push, update, remove, onValue, set } from "firebase/database"; // Import set
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database } from "../../../firebase";
import toast from "react-hot-toast";
import Image from "next/image";
import GetRatingMain from "./GetRatingMain";

type CountryOption = {
  label: string;
  value: string;
  flag: string;
  code: string;
};

type Country = {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  ccn3: string;
  cca3: string;
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
};

type RatingData = {
  id: string;
  name: string;
  email: string;
  phone: {
    phoneNumber: string;
    countryCode: string;
    countryFlag: string;
  };
  profession: string;
  website: string;
  description: string;
  myContribution: string;
  rating: number;
  review: string;
  imageUrl: string;
};

const RatingForm = () => {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null,
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(""); // Change here
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
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [ratingToDelete, setRatingToDelete] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [ratingToUpdate, setRatingToUpdate] = useState<RatingData | null>(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryData = response.data.map((country: Country) => ({
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
      const loadedRatings: RatingData[] = data
        ? Object.entries(data)
            .map(([id, rating]) => {
              // Type guard to ensure rating is an object
              if (typeof rating === "object" && rating !== null) {
                return { id, ...rating } as RatingData;
              }
              return null; // Return null for non-object values
            })
            .filter((rating): rating is RatingData => rating !== null) // Filter out nulls
        : [];

      setRatings(loadedRatings);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry || !phoneNumber || !imageUrl) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const ratingData: RatingData = {
        id: "",
        name,
        email,
        phone: {
          phoneNumber,
          countryCode: selectedCountry.value,
          countryFlag: selectedCountry.flag,
        },
        profession,
        website,
        description,
        myContribution,
        rating,
        review,
        imageUrl,
      };

      if (ratingToUpdate) {
        await update(ref(database, `ratings/${ratingToUpdate.id}`), ratingData);
        alert("Rating updated successfully!");
      } else {
        const newRatingRef = push(ref(database, "ratings"));
        await set(newRatingRef, ratingData);
        alert("Rating submitted successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("There was an issue submitting your rating. Please try again.");
    } finally {
      setLoading(false);
      setIsUpdateDialogOpen(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhoneNumber(""); // Ensure it resets to a string
    setSelectedCountry(null);
    setProfession("");
    setWebsite("");
    setDescription("");
    setMyContribution("");
    setRating(0);
    setReview("");
    setImageUrl("");
    setImageFile(null);
    setRatingToUpdate(null);
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

  const handleUpdateRating = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ratingToUpdate) {
      try {
        let url = imageUrl || ratingToUpdate.imageUrl;

        if (imageFile) {
          const storage = getStorage();
          const storageReference = storageRef(
            storage,
            `ratings/${imageFile.name}`,
          );
          await uploadBytes(storageReference, imageFile);
          url = await getDownloadURL(storageReference);
        }

        const updatedData: RatingData = {
          ...ratingToUpdate,
          phone: {
            countryCode:
              selectedCountry?.code || ratingToUpdate.phone.countryCode,
            phoneNumber: phoneNumber || "", // Default value
            countryFlag:
              selectedCountry?.flag || ratingToUpdate.phone.countryFlag,
          },
          imageUrl: url,
        };

        const ratingRef = ref(database, `ratings/${ratingToUpdate.id}`);
        await update(ratingRef, updatedData);
        toast.success("Rating updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Error updating rating:", error);
        toast.error("Failed to update rating!");
      } finally {
        setIsUpdateDialogOpen(false);
      }
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4 justify-center items-center">
      <Button onClick={() => setIsUpdateDialogOpen(true)} className="mb-4">
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
              <label htmlFor="country" className="block font-medium">
                Country
              </label>
              <Select
  value={selectedCountry}
  onChange={setSelectedCountry}
  options={countries}
  placeholder="Select a country"

  styles={{
    control: (provided) => ({
      ...provided,
      backgroundColor: '#321832', // Set background color of the control
      borderColor: 'darkred', // Optional: Change border color
      color: 'white', // Change text color
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: isSelected ? 'darkred' : isFocused ? 'lightcoral' : '#321832', // Background for options
      color: 'white', // Change option text color
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#321832', // Background for the dropdown menu
    }),
  }}
/>

            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block font-medium">
                Phone Number
              </label>
              <PhoneInput
                international
                defaultCountry="US"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || "")} // Handle undefined or null
                className="border p-2 w-full  "
                required
              />
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
                required
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
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rating" className="block font-medium">
                Rating
              </label>
              <Rating
                initialRating={rating}
                onChange={(rate) => setRating(rate)}
                emptySymbol="far fa-star text-gray-400"
                fullSymbol="fas fa-star text-yellow-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="review" className="block font-medium">
                Review
              </label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="border p-2 w-full"
                required
              />
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
              {imageUrl && (
                <Image src={imageUrl} alt="Preview" width={100} height={100} />
              )}
            </div>

            <DialogFooter className="flex  gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="button"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <GetRatingMain />
    </div>
  );
};

export default RatingForm;
