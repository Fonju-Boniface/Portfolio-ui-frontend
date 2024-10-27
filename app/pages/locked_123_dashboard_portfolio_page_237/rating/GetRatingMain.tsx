import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../firebase"; // Adjust the import path based on your setup
import ReactStars from "react-rating-stars-component";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const GetRatingMain = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const ratingsRef = ref(database, "ratings"); // Reference to the ratings collection

    const unsubscribe = onValue(ratingsRef, (snapshot) => {
      const data = snapshot.val();
      const ratingsArray = [];

      for (const id in data) { // Changed 'let' to 'const'
        ratingsArray.push({ id, ...data[id] }); // Include the id to use it for key in rendering
      }

      setRatings(ratingsArray); // Update the state with the fetched ratings
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <div className="flex justify-center items-center flex-col">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary my-5">Ratings</h2>
      <p className="my-5">
        See what <b className="text-primary">{ratings.length}</b> persons have written about my work
      </p>
      {/* Display the total number of ratings */}
      {ratings.length > 0 ? (
        <>
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
                      <p className="text-primary font-bold">I&apos;m a {rating.profession}</p> {/* Escaped apostrophe */}
                      <p className="text-center">{rating.description}</p>
                      <ReactStars
                        count={5}
                        size={24}
                        activeColor="#ffd700"
                        value={rating.rating} // Use the rating value for ReactStars
                        edit={false} // Prevent editing if you just want to display
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      ) : (
        <p>No ratings available.</p>
      )}
    </div>
  );
};

export default GetRatingMain;