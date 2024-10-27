"use client"
import React from 'react';
import ExperienceList from './ExperienceList';

const Home: React.FC = () => {
  const experienceItems = [
    {
      id: 1, //
      title: 'React.Js',//
      yearsOfExperience: "3",//
      experiencePercentage: 20,//
      experienceType: "Self made",//
      experienceDomain: "Frontend Development",//
      note: 'Skilled in React and Vue.',//
      description: 'Developed multiple web applications using React.js and Vue.js, focusing on responsive design and performance optimization.',//
      image: '/5.jpg', // Path to your image //
    },
    {
      id: 2, //
      title: 'JavaScript',//
      yearsOfExperience: "2",//
      experiencePercentage: 67,//
      experienceType: "Self made",//
      experienceDomain: "Frontend Development",//
      note: 'Skilled in React and Vue.',//
      description: 'Developed multiple web applications using React.js and Vue.js, focusing on responsive design and performance optimization.',//
      image: '/1.jpg', // Path to your image //
    },
    {
      id: 3, //
      title: 'HTML5',//
      yearsOfExperience: "4",//
      experiencePercentage: 90,//
      experienceType: "Self made",//
      experienceDomain: "Frontend Development",//
      note: 'Skilled in React and Vue.',//
      description: 'Developed multiple web applications using React.js and Vue.js, focusing on responsive design and performance optimization.',//
      image: '/2.jpg', // Path to your image //
    },
    {
      id: 4, //
      title: 'CSS3',//
      yearsOfExperience: "3",//
      experiencePercentage: 50,//
      experienceType: "Self made",//
      experienceDomain: "Frontend Development",//
      note: 'Skilled in React and Vue.',//
      description: 'Developed multiple web applications using React.js and Vue.js, focusing on responsive design and performance optimization.',//
      image: '/4.jpg', // Path to your image //
    },
   
  ];

  return (
    <div className="container mx-auto">
      <ExperienceList items={experienceItems} />
    </div>
  );
};

export default Home;