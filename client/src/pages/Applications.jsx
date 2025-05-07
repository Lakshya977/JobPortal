import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../Components/Footer'
const applications = () => {
  const [isedit, setisedit] = useState(false)
  const [resume, setresume] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 pb-20">
      <Navbar />
      
      {/* Resume Section */}
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Resume</h2>
        <div className="mt-6">
          {isedit ? (
            <label
              htmlFor="resumeupload"
              className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition"
            >
              <p className="text-gray-700 text-lg font-medium">Select Resume</p>
              <input
                id="resumeupload"
                onChange={(e) => setresume(e.target.files[0])}
                accept="application/pdf"
                type="file"
                hidden
              />
              <img
                src={assets.profile_upload_icon}
                alt="Upload Icon"
                className="w-16 h-16 opacity-80 hover:opacity-100 transition"
              />
              <button
                onClick={() => setisedit(false)}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              >
                Save
              </button>
            </label>
          ) : (
            <div className="flex items-center justify-between">
              <a
                href={resume ? URL.createObjectURL(resume) : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-200 transition duration-200"
              >
                📄 View Resume
              </a>
              <button
                onClick={() => setisedit(true)}
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
              {jobsApplied.map((job, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-white/20 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={job.logo} alt="" className="w-8 h-8 rounded-full" />
                    <span>{job.company}</span>
                  </td>
                  <td className="px-6 py-4">{job.title}</td>
                  <td className="px-6 py-4">{job.location}</td>
                  <td className="px-6 py-4">{moment(job.date).format('ll')}</td>
                  <td className="px-6 py-4">
                  <span
                className={`px-3 py-1 rounded-full text-xs font-medium border transition duration-200 transform hover:scale-105 hover:shadow-md ${
                job.status === 'Pending'
              ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-100'
               : job.status === 'Accepted'
              ? 'border-green-500 text-green-500 hover:bg-green-100'
             : 'border-red-500 text-red-500 hover:bg-red-100'
             }`}
              >
              {job.status}
                </span>
  
                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        <Footer></Footer>
    </div>
  )
}

export default applications
