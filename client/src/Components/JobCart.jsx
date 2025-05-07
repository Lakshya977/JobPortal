import React from 'react';
import companny from '../assets/company_icon.svg';
import { useNavigate } from 'react-router-dom';

const JobCart = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-50">
      <div className="flex items-center mb-4">
        <img
          src={companny}
          alt="Company Icon"
          className="h-10 w-10 rounded-full mr-4 transition-all duration-300 transform hover:scale-110"
        />
        <div>
          <h4 className="text-xl font-semibold text-gray-800 hover:text-purple-700 transition-colors duration-300">
            {job.title}
          </h4>
          <div className="text-sm text-gray-600 flex gap-3 mt-1">
            <span>{job.location}</span>
            <span>{job.level}</span>
          </div>
        </div>
      </div>

      <p
        className="text-gray-700 text-sm mt-3 mb-4 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
      />

      <div className="flex justify-between items-center mt-6 gap-4">
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="px-3 py-1 bg-purple-200 text-purple-800 rounded-md hover:bg-purple-300 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-xs"
        >
          Apply Now
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="px-3 py-1 text-purple-700 border border-purple-600 rounded-md hover:bg-purple-700 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105 text-xs"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default JobCart;
