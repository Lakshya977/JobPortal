
import React, { useContext, useRef, useState } from 'react';
import search_icon from '../assets/search_icon.svg';
import location_icon from '../assets/location_icon.svg';
import microsoft from '../assets/microsoft_logo.svg'
import adobe from '../assets/adobe_logo.png'
import walmart from '../assets/walmart_logo.svg'
import accenture from '../assets/accenture_logo.png'
import samsung from '../assets/samsung_logo.png'
import amazon from '../assets/amazon_logo.png'
import AppContext from '../context/AppContext';

const Hero = () => {
  const { setSearchFilter, setIsSearch } = useContext(AppContext);
  const [searchClicked, setSearchClicked] = useState(false);
  const titleref = useRef(null);
  const locationref = useRef(null);

  const onsearch = () => {
    const title = titleref.current.value;
    const location = locationref.current.value;

    setSearchFilter({ title, location });
    setIsSearch(true);
    setSearchClicked(true);

    
    setTimeout(() => setSearchClicked(false), 1000);

    console.log({ title, location });
  };

  return (
    <>
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 py-12 px-4 flex flex-col items-center min-h-[60vh]">
        <div className="w-full max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Over 10,000+ jobs to apply
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-purple-200 mb-8">
            Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take<br />
            the First Step Toward Your Future!
          </p>
          <div className={`bg-white rounded-full shadow-xl flex items-center px-4 py-2 w-full max-w-3xl mx-auto transition-all duration-500 ${
            searchClicked ? 'ring-2 ring-blue-400 scale-105' : ''
          }`}>
            <div className="flex items-center w-2/5">
              <img src={search_icon} alt="Search" className="h-5 w-5 mr-2" />
              <input
                type="text"
                placeholder="Search for jobs"
                className="w-full border-none outline-none text-sm sm:text-base bg-transparent"
                ref={titleref}
              />
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex items-center w-2/5">
              <img src={location_icon} alt="Location" className="h-5 w-5 mr-2" />
              <input
                type="text"
                placeholder="Location"
                ref={locationref}
                className="w-full border-none outline-none text-sm sm:text-base bg-transparent"
              />
            </div>
            <button
              onClick={onsearch}
              className={`ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm sm:text-base font-semibold transition-transform duration-300 active:scale-95 ${
                searchClicked ? 'animate-pulse' : ''
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white py-10 px-4">
        <div className="w-full max-w-5xl mx-auto text-center border border-gray-200 shadow-2xl rounded-xl p-6 mb-10 transition-all hover:shadow-3xl">
          <p className="text-gray-700 text-base sm:text-lg font-medium mb-6">Trusted By:</p>
          <div className="flex flex-wrap justify-center gap-6">
  {[microsoft, adobe, walmart, accenture, samsung, amazon].map((logo, i) => (
    <img
      key={i}
      src={logo}
      alt="Company Logo"
      className="h-8 transition-transform duration-300 transform hover:scale-110 hover:opacity-80"
    />
  ))}
</div>

        </div>
      </div>
    </>
  );
};

export default Hero;
