"use client"
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, Star } from "lucide-react";
import { useEffect, useState } from "react";

const Dialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check local storage to see if the dialog was closed previously
    const dialogClosed = localStorage.getItem("dialogClosed");
    if (!dialogClosed) {
      setIsOpen(true);
    }
  }, []);

  const closeDialog = () => {
    setIsOpen(false);
    localStorage.setItem("dialogClosed", "true"); // Set in local storage when closed
  };

  if (!isOpen) return null; // Don't render if the dialog is closed

  return (
    
    <div
      className="fixed inset-0 right-0 bottom-0 flex items-center justify-center bg-gray-950
        bg-opacity-80 w-full z-50 p-2"
    >
      <div
        className="bg-white p-4  shadow-lg flex flex-col hover:shadow-lg transition
          duration-300 text-center justify-between border-b border-gray-300
          bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
          dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
          lg:w-auto rounded-md lg:border lg:bg-gray-200 lg:p-2 lg:dark:bg-zinc-800/30 max-w-96 gap-2"
      >
        <div className="">

        <h2 className="text-2xl font-bold text-primary">Welcome to My Site!</h2>
        <br/>
        
        <p>Here is some important information for you.</p>
        <p>In order to do the following, you must be signed in.</p>
        </div>

        <div className=" w-full gap-1 flex justify-between items-start flex-wrap">
          <div
            className="hover:shadow-lg transition duration-300 text-center flex flex-col items-center justify-center  border-b
              border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:from-inherit lg:static  rounded-md
              lg:border lg:bg-gray-200 lg:p-2 dark:bg-zinc-900 w-[49%]"
          >
            <MessageCircleIcon className="h-[3rem] w-[3rem] text-primary" />
            <p>Messaging me</p>
          </div>
          <div
            className="hover:shadow-lg transition duration-300 text-center flex flex-col items-center justify-center  border-b
              border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:from-inherit lg:static  rounded-md
              lg:border lg:bg-gray-200 lg:p-2 dark:bg-zinc-900 w-[49%]"
          >
            <Star className="h-[3rem] w-[3rem] text-primary" />
            <p>Rating me</p>
          </div>
          
          
         
        </div>
        <div className="flex justify-center items-center gap-1 w-full">

       
        <Button
          variant="outline"
          onClick={closeDialog}
          size="icon"
          className="w-full mt-4 px-4 py-2 dark:text-white rounded"
          >
          Close
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-full mt-4 px-4 py-2 bg-primary text-white rounded"
          >
          SignIn
        </Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
