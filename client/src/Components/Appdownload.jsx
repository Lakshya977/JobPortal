import React from 'react';
import playstore from '../assets/play_store.svg';
import appstore from '../assets/app_store.svg';
import mainimage from '../assets/app_main_img.png';

const AppDownload = () => {
  return (
    <div className="mt-16 flex flex-col md:flex-row justify-between items-center py-12 px-4 md:px-12 bg-gray-100 max-w-4xl mx-auto rounded-xl gap-8">
      <div className="flex flex-col gap-6 md:w-1/2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight max-w-sm text-center md:text-left">
          Download Mobile App For Better Experience
        </h1>
        <div className="flex gap-4 justify-center md:justify-start">
          <a href="#">
            <img
              src={playstore}
              alt="Play Store"
              className="w-32 h-auto transform transition-transform hover:scale-105"
            />
          </a>
          <a href="#">
            <img
              src={appstore}
              alt="App Store"
              className="w-32 h-auto transform transition-transform hover:scale-105"
            />
          </a>
        </div>
      </div>
      <img
        src={mainimage}
        alt="App Preview"
        className="md:w-1/2 max-w-xs h-auto rounded-xl shadow-lg"
      />
    </div>
  );
};

export default AppDownload;
