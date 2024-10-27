import React from "react";
import GetSkills from "./GetSkills";

const Skills = () => {

  return (
    <div className="flex flex-col justify-start items-start gap-10 w-full relative">
      <h1 className=" mt-8 text-5xl font-bold">
        Ski<b className="text-primary">lls</b>
      </h1>
      
      <GetSkills />
    </div>
  );
};

export default Skills;
