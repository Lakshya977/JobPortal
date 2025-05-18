import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../Components/Loading';
import Navbar from '../Components/Navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import JobCart from '../Components/JobCart';
import Footer from '../Components/Footer';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useAuth } from '@clerk/clerk-react';

const ApplyJob = () => {
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyApplied, setisAlreadyApplied] = useState(false);
  const { jobs, backendUrl, userData, userApplications, isLoadingUserData, fetchUserApplications } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyhandler = async () => {
    try {
      if (isLoadingUserData) {
        enqueueSnackbar('Loading user data, please wait', { variant: 'info' });
        return;
      }
      if (!isSignedIn || !userData) {
        enqueueSnackbar('Login to apply', { variant: 'error' });
        navigate('/login');
        return;
      }
      if (!userData.resume) {
        enqueueSnackbar('Upload Resume to continue', { variant: 'error' });
        navigate('/applications');
        return;
      }
      if (userApplications.some(app => app.jobId === jobData._id)) {
        enqueueSnackbar('You have already applied for this job', { variant: 'info' });
        return;
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`, // Reverted to original
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        enqueueSnackbar('Application submitted successfully', { variant: 'success' });
        await fetchUserApplications();
      } else {
        enqueueSnackbar(data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to apply for job', {
        variant: 'error',
      });
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.job);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) return <Loading />;

  if (!jobData) {
    return (
      <div className="text-center py-10 text-lg font-semibold text-gray-600">
        Job not found
      </div>
    );
  }

  const company = jobData.companyID || {};

  return (
    <>
      <Navbar />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Job Info */}
          <div className="bg-[#f7f3ff] shadow-md rounded-xl p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                {company.image ? (
                  <img
                    src={company.image}
                    alt={company.name || 'Company Logo'}
                    className="w-full h-full object-contain rounded-md"
                    onError={(e) => (e.target.src = assets.default_logo)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                    No Logo
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2 text-purple-800">{jobData.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-700 text-sm">
                  <span className="flex items-center gap-2">
                    <img src={assets.suitcase_icon} alt="icon" className="w-4 h-4" />
                    {company.name || 'Unknown Company'}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.location_icon} alt="icon" className="w-4 h-4" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.person_icon} alt="icon" className="w-4 h-4" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.money_icon} alt="icon" className="w-4 h-4" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                onClick={applyhandler}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition cursor-pointer"
                disabled={isLoadingUserData}
              >
                Apply Now
              </button>
              <p className="text-sm text-gray-500 sm:ml-4">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100">
            <h2 className="font-bold text-2xl text-purple-800 mb-4 border-b pb-2 border-purple-200">
              Job Description
            </h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: jobData.description }}
            />
          </div>

          {/* More Jobs */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100">
            <h2 className="font-bold text-2xl text-purple-800 mb-4 border-b pb-2 border-purple-200">
              More Jobs from {company.name || 'this Company'}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {jobs
                .filter(job => job._id !== jobData._id && job.companyID?._id === company._id)
                .slice(0, 4)
                .map((job, index) => (
                  <JobCart key={job._id} job={job} />
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ApplyJob;