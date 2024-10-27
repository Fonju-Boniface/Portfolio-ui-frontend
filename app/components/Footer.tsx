import React from "react";
// import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import DownResume from "./navbars/profile/DownResume";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Company</h2>
          <p className="text-gray-400">
            I provide good and quality designs to help your Business succeed. Hire me and as my skills grow so will your establishments.
            
          </p>
          
          <Link
            href="tel:+237670436196"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            Phone: <b className="text-primary">+237670436196</b>
          </Link>
          <br />
          <Link
            href="mailto:lockedcode237@gmail.com"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            Email: <b className="text-primary">lockedcode237@gmail.com</b>
          </Link>

       
        </div>

        {/* Navigation Links */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/pages/about-me"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                About Me
              </Link>
            </li>
            <li>
              <Link
                href="/pages/projects"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/pages/contact"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Contact Me
              </Link>
            </li>
            <li>
              <Link
                href="/pages/experience"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                href="/pages/reviews"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Resume</h2>
          <p className="text-gray-400 mb-4">
            Download my resume to know some extral informatiom about me and my career growth.
          </p>
          
          <DownResume />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-12 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Locked- Code . All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
