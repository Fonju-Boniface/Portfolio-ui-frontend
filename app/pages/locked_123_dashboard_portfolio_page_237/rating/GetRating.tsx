"use client";
import React, { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../../../firebase"; // Adjust this import path as necessary
import Rating from "react-rating"; // Ensure correct import

import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// RatingData interface definition
interface RatingData {
  id: string;
  name: string;
  profession: string;
  description: string;
  rating: number;
  imageUrl: string; // Add other properties as needed
}

const GetRating: React.FC = () => {
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [editingRating, setEditingRating] = useState<RatingData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const ratingsRef = ref(database, "ratings");

    const unsubscribe = onValue(ratingsRef, (snapshot) => {
      const data = snapshot.val();
      const ratingsArray: RatingData[] = []; // Specify the type for the array
      for (const id in data) {
        ratingsArray.push({ id, ...data[id] });
      }
      setRatings(ratingsArray); // Update the state with fetched ratings
    });

    return () => unsubscribe();
  }, []);

  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const handleEdit = (rating: RatingData) => { // Specify the type for rating
    setEditingRating(rating);
    setIsDialogOpen(true);
  };

  const handleDelete = async (ratingId: string) => { // Specify the type for ratingId
    try {
      await remove(ref(database, `ratings/${ratingId}`));
      alert("Rating deleted successfully");
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  const handleSave = async () => {
    if (editingRating) {
      try {
        await update(ref(database, `ratings/${editingRating.id}`), {
          name: editingRating.name,
          profession: editingRating.profession,
          description: editingRating.description,
          rating: editingRating.rating,
        });
        alert("Rating updated successfully");
        setIsDialogOpen(false);
        setEditingRating(null);
      } catch (error) {
        console.error("Error updating rating:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary my-5">Ratings</h2>
      <p className="my-5">
        See what <b className="text-primary">{ratings.length}</b> persons have written about my work
      </p>
      {ratings.length > 0 ? (
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-md"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="w-full">
            {ratings.map((rating) => (
              <CarouselItem key={rating.id}>
                <Card className="w-full">
                  <CardContent className="flex aspect-square items-center flex-col justify-center p-1 px-2 gap-1 text-center">
                    <Image
                      src={rating.imageUrl}
                      alt={rating.name}
                      width={150}
                      height={150}
                      className="h-20 w-20 rounded-full outline-dashed outline-2 outline-primary p-1"
                    />
                    <h3 className="uppercase mt-3">{rating.name}</h3>
                    <p className="text-primary font-bold">I&apos;m a {rating.profession}</p>
                    <p className="text-center">{rating.description}</p>
                    <Rating
                      initialRating={rating.rating}
                      readonly
                      emptySymbol="⭐"
                      fullSymbol="⭐"
                      className="text-yellow-500"
                    />
                    <div className="flex space-x-2 mt-3">
                      <Button className="bg-primary" onClick={() => handleEdit(rating)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(rating.id)}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p>No ratings available.</p>
      )}

      {isDialogOpen && editingRating && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogTitle>Edit Rating</DialogTitle>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={editingRating.name}
                onChange={(e) => setEditingRating({ ...editingRating, name: e.target.value })}
                className="block border rounded p-2 w-full"
              />
            </div>
            <div>
              <label>Profession:</label>
              <input
                type="text"
                value={editingRating.profession}
                onChange={(e) => setEditingRating({ ...editingRating, profession: e.target.value })}
                className="block border rounded p-2 w-full"
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={editingRating.description}
                onChange={(e) => setEditingRating({ ...editingRating, description: e.target.value })}
                className="block border rounded p-2 w-full"
              />
            </div>
            <div>
              <label>Rating:</label>
              <Rating 
                initialRating={editingRating.rating}
                onChange={(newRating: number) => setEditingRating({ ...editingRating, rating: newRating })} // Explicitly declare newRating type
                emptySymbol="⭐"
                fullSymbol="⭐"
                className="text-yellow-500"
              />
            </div>
            <Button onClick={handleSave} className="mt-4">
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GetRating;
