import React from 'react';
import { assets, viewApplicationsPageData } from '../assets/assets';

const ViewApplications = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b pb-2">Applications</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-purple-100 text-purple-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Job Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Resume</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={index} className="hover:bg-purple-50">
                <td className="px-4 py-3 font-medium text-gray-600">{index + 1}</td>

                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={applicant.imgSrc} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  <span>{applicant.name}</span>
                </td>

                <td className="px-4 py-3">{applicant.jobTitle}</td>
                <td className="px-4 py-3">{applicant.location}</td>

                <td className="px-4 py-3 flex items-center gap-2">
                  <a
                    href="#"
                    target="_blank"
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Resume
                  </a>
                  <img
                    src={assets.resume_download_icon}
                    alt="download"
                    className="w-5 h-5 cursor-pointer"
                  />
                </td>

                <td className="px-4 py-3">
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-purple-600 font-semibold px-2">
                      •••
                    </button>
                    <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md border p-2 right-0 z-10">
                      <button className="px-4 py-1 hover:bg-purple-100 rounded text-green-600 text-sm font-medium">
                        Accept
                      </button>
                      <button className="px-4 py-1 hover:bg-purple-100 rounded text-red-600 text-sm font-medium">
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
