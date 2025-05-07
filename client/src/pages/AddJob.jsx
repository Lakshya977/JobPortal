import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure Quill styles are imported
import { assets, JobCategories, JobLocations } from '../assets/assets';

const AddJob = () => {
  const [title, settitle] = useState('');
  const [location, setlocation] = useState('Bangalore');
  const [category, setcategory] = useState('Programming');
  const [level, setlevel] = useState('Beginner level');
  const [salary, setsalary] = useState(0);
  const editorref = useRef(null);
  const quillref = useRef(null);

  useEffect(() => {
    if (!quillref.current && editorref.current) {
      quillref.current = new Quill(editorref.current, {
        theme: 'snow'
      });
    }
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b pb-2">Add a New Job</h2>

        <form className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Job Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="e.g., Frontend Developer"
              onChange={e => settitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Job Description</label>
            <div
              ref={editorref}
              className="h-40 bg-white border border-gray-300 rounded-md overflow-auto"
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={category}
                onChange={e => setcategory(e.target.value)}
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
                onChange={e => setlocation(e.target.value)}
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
                onChange={e => setlevel(e.target.value)}
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
                onChange={e => setsalary(e.target.value)}
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
