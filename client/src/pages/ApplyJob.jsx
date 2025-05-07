import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../context/AppContext';
import Loading from '../Components/loading';
import Navbar from '../Components/Navbar';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import JobCart from '../Components/JobCart';
import Footer from '../Components/Footer';

const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const { jobs } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const data = jobs.find(job => job._id === id);
      if (data) {
        setJobData(data);
      } else {
        setJobData(null);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id, jobs]);

  if (loading) {
    return <Loading />;
  }

  if (!jobData) {
    return <div className="text-center py-10 text-lg font-semibold text-gray-600">Job not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Job Info */}
          <div className="bg-[#f7f3ff] shadow-md rounded-xl p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <img src={jobData.companyId.image} alt="Company Logo" className="w-full h-full object-contain rounded-md" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2 text-purple-800">{jobData.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-700 text-sm">
                  <span className="flex items-center gap-2">
                    <img src={assets.suitcase_icon} alt="icon" className="w-4 h-4" />
                    {jobData.companyId.name}
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
              <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition">
                Apply Now
              </button>
              <p className="text-sm text-gray-500 sm:ml-4">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100">
            <h2 className="font-bold text-2xl text-purple-800 mb-4 border-b pb-2 border-purple-200">Job Description</h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: jobData.description }}
            />
            <button
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
            >
              Apply Now
            </button>
          </div>

          {/* More Jobs */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100">
            <h2 className="font-bold text-2xl text-purple-800 mb-4 border-b pb-2 border-purple-200">
              More Jobs from {jobData.companyId.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {jobs
            .filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .map((job, index) => (
    <JobCart key={index} job={job} />
))}
            </div>
          </div>
        </div>
          <Footer></Footer>
      </div>
    </>
  );
};

export default ApplyJob;
