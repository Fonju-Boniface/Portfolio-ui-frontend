"use client";

import AboutMiss from '../locked_123_dashboard_portfolio_page_237/about/aboutmission/AboutMiss';
import AboutTextField from '../locked_123_dashboard_portfolio_page_237/about/abouttext/AboutTextField';
import AboutHobbies from '../locked_123_dashboard_portfolio_page_237/about/abouthobbies/AboutHobbies';


export default function AboutPage() {
  return (
    <div className=" mx-auto px-1 py-4 md:py-12 lg:py-16 h-[100%]">
      {/* About Section */}
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">About Me</h1>
        <AboutTextField />
      </section>

      <h2 className=' font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-[8rem] mb-6 text-center'> Mission, Vision, <b className="text-primary">Core Values</b></h2>

      {/* Mission, Vision, Core Values */}
      <AboutMiss />

      {/* Hobbies Section */}
      <h2 className=' font-bold text-xl sm:text-3xl md:text-4xl lg:text-6xl mt-[8rem] mb-6 text-center'>My <b className="text-primary">Hobbies</b></h2>

      <AboutHobbies />


    </div>
  );
}


// export default AboutPage;
