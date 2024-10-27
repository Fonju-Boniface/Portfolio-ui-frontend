"use client"
import React from 'react'
import { useEffect } from "react";
import { analytics } from "../../firebase";

const Page = () => {
    useEffect(() => {
        if (analytics) {
          console.log("Firebase analytics initialized.");
        }
      }, []);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to My Portfolio</h1>
      <p>This project uses Firebase for analytics and more.</p>
    </div>
  )
}

export default Page


// "use client"
// import React from 'react'

// const Page = () => {
    
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Welcome to My Portfolio</h1>
//       <p>This project uses Firebase for analytics and more.</p>
//     </div>
//   )
// }

// export default Page
