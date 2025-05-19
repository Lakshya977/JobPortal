import React, { useContext, useState, useEffect, useCallback } from 'react';
import Navbar from '../Components/Navbar';
import { assets } from '../assets/assets';
import moment from 'moment';
import Footer from '../Components/Footer';
import { AppContext } from '../context/AppContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch data only once when user.id changes
  useEffect(() => {
    if (user?.id) {
      const loadData = async () => {
        try {
          await Promise.all([fetchUserData(), fetchUserApplications()]);
        } catch (error) {
          enqueueSnackbar('Failed to load data', { variant: 'error' });
          console.error('Fetch error:', error);
        }
      };
      loadData();
    }
  }, [user?.id, fetchUserData, fetchUserApplications, enqueueSnackbar]);

  const updateResume = async () => {
    if (!resume) {
      enqueueSnackbar('Please select a resume file', { variant: 'error' });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);

      const token = await getToken();
      if (!token) {
        enqueueSnackbar('Authentication token not found', { variant: 'error' });
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (data.success) {
        enqueueSnackbar('Resume uploaded successfully', { variant: 'success' });
        setIsEdit(false);
        setResume(null);
        await fetchUserData(); // Refresh userData
      } else {
        enqueueSnackbar(data.message || 'Failed to upload resume', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to upload resume', { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // Memoized JobRow component to prevent unnecessary re-renders
  const JobRow = React.memo(({ job, index }) => (
    <tr key={job.jobId || index} className="border-b border-gray-200 hover:bg-white/20 transition">
      <td className="px-6 py-4 flex items-center gap-3">
        <img
          src={job.logo || assets.default_logo}
          alt={job.company || 'Company'}
          className="w-8 h-8 rounded-full object-cover"
          loading="lazy"
          onError={(e) => (e.target.src = assets.default_logo)}
        />
        <span>{job.company || 'N/A'}</span>
      </td>
      <td className="px-6 py-4">{job.title || 'N/A'}</td>
      <td className="px-6 py-4">{job.location || 'N/A'}</td>
      <td className="px-6 py-4">{job.date ? moment(job.date).format('ll') : 'N/A'}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border transition duration-200 transform hover:scale-105 hover:shadow-md ${
            job.status === 'Pending'
              ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-100'
              : job.status === 'Accepted'
              ? 'border-green-500 text-green-500 hover:bg-green-100'
              : job.status === 'Rejected'
              ? 'border-red-500 text-red-500 hover:bg-red-100'
              : 'border-gray-500 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {job.status || 'Unknown'}
        </span>
      </td>
    </tr>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 pb-20">
      <Navbar />

      {/* Resume Section */}
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Resume</h2>
        <div className="mt-6">
          {isEdit ? (
            <label
              htmlFor="resumeupload"
              className={`flex flex-col items-center gap-4 p-6 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <p className="text-gray-700 text-lg font-medium">{resume ? resume.name : 'Select Resume'}</p>
              <input
                id="resumeupload"
                onChange={(e) => setResume(e.target.files[0])}
                accept="application/pdf"
                type="file"
                disabled={isUploading}
                hidden
              />
              <img
                src={assets.profile_upload_icon}
                alt="Upload Icon"
                className="w-16 h-16 opacity-80 hover:opacity-100 transition"
                loading="lazy"
              />
              <button
                onClick={updateResume}
                disabled={isUploading}
                className={`mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </button>
            </label>
          ) : (
            <div className="flex items-center justify-between">
              <a
                href={userData?.resume || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block px-4 py-2 font-semibold rounded-lg shadow transition duration-200 ${
                  userData?.resume
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                📄 {userData?.resume ? 'View Resume' : 'No Resume Uploaded'}
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 shadow"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Applied Section */}
      <div className="max-w-6xl mx-auto mt-12 p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Jobs Applied</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3 font-medium uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.length > 0 ? (
                userApplications.map((job, index) => (
                  <JobRow key={job.jobId || index} job={job} index={index} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Applications;