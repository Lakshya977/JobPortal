import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const ViewApplications = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true); // Added for proper loading state

  const fetchCompanyJobApplication = async () => {
    try {
      const token = companyToken;
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { token: token },
      });

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

   const updateStatus = async (applicationId, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { applicationId, status },
        {
          headers: { token: companyToken },
        }
      );

      if (data.success) {
        enqueueSnackbar(`Application ${status}`, { variant: 'success' });
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status } : app
          )
        );
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplication();
    } else {
      setLoading(false);
    }
  }, [companyToken]);
  return (
    <>
      <style>
        {`
          .resume-button {
            display: inline-flex;
            align-items: center;
            padding: 8px 14px;
            background-color: #6b46c1; /* Purple theme */
            color: white;
            border-radius: 6px;
            font-weight: 500;
            text-decoration: none;
            transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
          }
          .resume-button:hover {
            background-color: #553c9a; /* Darker purple on hover */
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .resume-button:active {
            transform: translateY(0);
            box-shadow: none;
          }
          .resume-button img {
            width: 18px;
            height: 18px;
            margin-left: 8px;
            transition: transform 0.2s;
          }
          .resume-button:hover img {
            transform: scale(1.1);
          }
        `}
      </style>
      {loading ? (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b pb-2">Applications</h2>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b pb-2">Applications</h2>
          <p className="text-gray-600">No applications found.</p>
        </div>
      ) : (
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
                {applicants.map((applicant, index) => (
                  <tr key={applicant._id} className="hover:bg-purple-50">
                    <td className="px-4 py-3 font-medium text-gray-600">{index + 1}</td>

                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={applicant.userId?.image || assets.default_avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{applicant.userId?.name || 'Unknown'}</span>
                    </td>

                    <td className="px-4 py-3">{applicant.jobId?.title || 'N/A'}</td>
                    <td className="px-4 py-3">{applicant.jobId?.location || 'N/A'}</td>

                    <td className="px-4 py-3">
                      <a
                        href={applicant.resume || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-button"
                      >
                        Resume
                        <img
                          src={assets.resume_download_icon}
                          alt="download"
                          className="download-icon"
                        />
                      </a>
                    </td>

                    <td className="px-4 py-3">
  <div className="flex items-center gap-2">
    <span
      className={`text-sm font-medium capitalize ${
        applicant.status === 'accepted'
          ? 'text-green-600'
          : applicant.status === 'rejected'
          ? 'text-red-600'
          : 'text-gray-500'
      }`}
    >
      {applicant.status || 'applied'}
    </span>

    <div className="relative group">
      <button className="text-gray-700 hover:text-purple-600 font-semibold px-2">
        •••
      </button>
      <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md border p-2 right-0 z-10">
        <button
          className="px-4 py-1 hover:bg-purple-100 rounded text-green-600 text-sm font-medium"
          onClick={() => updateStatus(applicant._id, 'accepted')}
        >
          Accept
        </button>
        <button
          className="px-4 py-1 hover:bg-purple-100 rounded text-red-600 text-sm font-medium"
          onClick={() => updateStatus(applicant._id, 'rejected')}
        >
          Reject
        </button>
      </div>
    </div>
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewApplications;