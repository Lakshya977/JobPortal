import React from 'react';
import { manageJobsData } from '../assets/assets';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ManageJobs = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Jobs</h2>
          <button onClick={()=>navigate('/dashboard/add-job')} className="px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
            + Add New Job
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead>
              <tr className="border-b border-gray-300 text-gray-700 uppercase text-xs">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Job Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Applicants</th>
                <th className="px-6 py-3">Visible</th>
              </tr>
            </thead>
            <tbody>
              {manageJobsData.map((job, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-white/30 transition duration-200"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4">{moment(job.date).format('ll')}</td>
                  <td className="px-6 py-4">{job.location}</td>
                  <td className="px-6 py-4">{job.applicants}</td>
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
