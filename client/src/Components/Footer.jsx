import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <img
            src={assets.logo}
            alt="Company Logo"
            className="w-36 object-contain"
          />
        </div>

        {/* Center - Tagline or Links */}
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} InsiderJobs. All rights reserved.
        </div>

        {/* Right - Social Icons */}
        <div className="flex gap-3">
          <img
            src={assets.instagram_icon}
            alt="Instagram"
            className="w-8 h-8 hover:opacity-80 transition-transform transform hover:scale-110 cursor-pointer"
          />
          <img
            src={assets.twitter_icon}
            alt="Twitter"
            className="w-8 h-8 hover:opacity-80 transition-transform transform hover:scale-110 cursor-pointer"
          />
          <img
            src={assets.facebook_icon || assets.instagram_icon}
            alt="LinkedIn"
            className="w-8 h-8 hover:opacity-80 transition-transform transform hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
