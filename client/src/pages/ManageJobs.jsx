import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const ManageJobs = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [job, setJob] = useState([]);
  const { backendUrl, companytoken } = useContext(AppContext);

  const fetchJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companytoken },
      });

      if (data.success) {
        setJob(data.jobdata.reverse());
        console.log(data.jobdata);
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companytoken } }
      );

      if (data.success) {
        enqueueSnackbar(data.message, { variant: 'success' });
        fetchJobApplications();
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    if (companytoken) {
      fetchJobApplications();
    }
  }, [companytoken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Jobs</h2>
          <button
            onClick={() => navigate('/dashboard/add-job')}
            className="cursor-pointer px-6 py-2.5 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition duration-200"
          >
            + Add New Job
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-inner">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-300">
              <tr className="uppercase text-xs text-gray-600">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Applicants</th>
                <th className="px-6 py-4">Visible</th>
              </tr>
            </thead>
            <tbody>
              {job.map((jobItem, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-white/50 transition duration-150"
                >
                  <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{jobItem.title}</td>
                  <td className="px-6 py-4">{moment(jobItem.date).format('ll')}</td>
                  <td className="px-6 py-4">{jobItem.location}</td>
                  <td className="px-6 py-4">{jobItem.applicants}</td>
                  <td className="px-6 py-4">
                    <input
                      onChange={() => changeJobVisibility(jobItem._id)}
                      type="checkbox"
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                      checked={jobItem.visible}
                    />
                  </td>
                </tr>
              ))}
              {job.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No jobs posted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
