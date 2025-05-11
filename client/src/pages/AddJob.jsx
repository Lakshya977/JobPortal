import React, { useContext, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure Quill styles are imported
import { assets, JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useSnackbar } from 'notistack';

const AddJob = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { backendUrl, companyToken } = useContext(AppContext); // Use companyToken from context
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bangalore');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner level');
  const [salary, setSalary] = useState(0);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    try {
      const description = quillRef.current.root.innerHTML;
      const { data } = await axios.post(backendUrl + "/api/company/postjob", 
        { title, description, location, salary, category, level }, 
        { headers: { token: companyToken } } // Use companyToken here
      );
      if (data.success) {
        enqueueSnackbar(data.message, { variant: "success" });
        setTitle('');
        setSalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      });
    }
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b pb-2">Add a New Job</h2>

        <form onSubmit={onSubmitHandle} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Job Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="e.g., Frontend Developer"
              onChange={e => setTitle(e.target.value)} // Correct variable name
              value={title}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Job Description</label>
            <div
              ref={editorRef}
              className="h-40 bg-white border border-gray-300 rounded-md overflow-auto"
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={category}
                onChange={e => setCategory(e.target.value)} // Correct variable name
              >
                {JobCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={location}
                onChange={e => setLocation(e.target.value)} // Correct variable name
              >
                {JobLocations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Job Level</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={level}
                onChange={e => setLevel(e.target.value)} // Correct variable name
              >
                <option value="Beginner level">Beginner Level</option>
                <option value="Intermediate level">Intermediate Level</option>
                <option value="Senior level">Senior Level</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Salary (INR)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="e.g., 50000"
                onChange={e => setSalary(e.target.value)} // Correct variable name
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
          >
            Add Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
