import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../../firebase"; // Adjust the path as needed

interface Item {
  iconName: string;
  name: string;
  text: string;
}

const AboutMiss = () => {
  const [data, setData] = useState<{ [key: string]: Item }>({});
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const dataRef = ref(database, "your-miss-viss");

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const snapshotData = snapshot.val();
      setData(snapshotData || {});
      setLoading(false); // Stop loading when data is fetched
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <section className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {Object.entries(data).map(([id, item]) => (
            <div
              key={id}
              className="p-6 rounded-lg shadow-md text-center justify-center border-b border-gray-300
                bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
                dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
                lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
            >
              <i className={`${item.iconName} text-primary text-4xl mb-4`}></i>

              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="mt-2 text-sm sm:text-base">{item.text}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default AboutMiss;