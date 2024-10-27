import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../../firebase';
import { Button } from '@/components/ui/button';

const GetEducation = () => {
  const [educationData, setEducationData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEducationData = () => {
      const db = getDatabase(app);
      const educationRef = ref(db, 'MyEducations');

      onValue(educationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const educationArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setEducationData(educationArray);
        }
        setLoading(false);
      });
    };

    fetchEducationData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl sm:mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-8">My Educations</h2>
      {educationData.length === 0 ? (
        <p className="text-center">No education data found.</p>
      ) : (
        <div className="relative  grid grid-cols-1 gap-4 mt-8">
          {educationData.map((education) => (
            <div
              key={education.id}
              className="mb-8 flex flex-col relative sm:p-2 rounded-md"
            >
             <div className="p-1 sm:p-4 flex w-full ">

<p className="text-sm text-gray-500">
                   {education.startDate} to {education.endDate}
                </p>
                
             </div>
              {/* Education Content */}
              <div className="sm:p-4 p-1  rounded-lg shadow-md hover:shadow-lg transition duration-300
                items-start justify-between border-b border-gray-300 bg-gradient-to-b
                from-zinc-200 backdrop-blur-2xl dark:border-neutral-800
                dark:bg-zinc-800/30 dark:from-inherit   lg:rounded-md
                lg:border lg:bg-gray-200  lg:dark:bg-zinc-800/30 ">
                <div className="flex flex-col gap-2 shadow-md hover:shadow-lg transition duration-300
                items-start justify-between border-b border-gray-300 bg-gradient-to-b
                from-zinc-200 backdrop-blur-2xl dark:border-neutral-800
                dark:bg-zinc-800/30 dark:from-inherit   lg:rounded-md
                lg:border lg:bg-gray-200  lg:dark:bg-zinc-800/30 p-2">
                <h3 className="text-2xl font-semibold mb-2">
                  {education.educationName}
                </h3>
                <p className="text-sm ">
                  <strong className='text-primary'>Institution:</strong> {education.institution}
                </p>
                
                <p className="text-sm ">
                  <strong className='text-primary'>Type:</strong> {education.SkType}
                </p>
                <p className="text-sm ">
                  <strong className='text-primary'>Status:</strong> {education.status}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong className='text-primary'>Description:</strong> {education.SkDescription}
                </p>
                </div>

                {/* Learned Tags */}
                <div className="mb-2 p-2">
                  <strong className='capitalize text-primary'>some of what i learnt:</strong>
                  <div className="flex flex-wrap mt-1">
                    {education.learnedTags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-primary text-sm px-3 py-1 rounded-md mr-2 mb-2shadow-md hover:shadow-lg transition duration-300
                items-start justify-between border-b border-gray-300 bg-gradient-to-b
                from-zinc-200 backdrop-blur-2xl dark:border-neutral-800
                dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl
                lg:border lg:bg-gray-200  lg:dark:bg-zinc-800/30 "
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education Image */}
                {/* {education.imageUrl && (
                  <div className="mb-2">
                    <Image
                      src={education.imageUrl}
                      alt={education.educationName}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </div>
                )} */}

                {/* PDF Link */}
                {education.pdfUrl && (
                  <a
                    href={education.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary capitalize"
                  >
                    <Button
                    variant="outline"
                    className="bg-primary w-full text-secondary flex items-center space-x-2 transition-all "
                  >

                    View the document
                  </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetEducation;
