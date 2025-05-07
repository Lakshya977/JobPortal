import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../context/AppContext';
import cross from '../assets/cross_icon.svg';
import { JobCategories, JobLocations } from '../assets/assets';
import JobCart from './JobCart';
import lefticon from '../assets/left_arrow_icon.svg'; 
import righticon from '../assets/right_arrow_icon.svg';

const JobListing = () => {
  const { searchFilter, setSearchFilter, isSearch, jobs } = useContext(AppContext);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filteredJob, setFilteredJob] = useState(jobs);
  const [currentPage, setCurrentPage] = useState(1);

  const clearFilter = (filterType) => {
    setSearchFilter((prev) => ({
      ...prev,
      [filterType]: '',
    }));
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category);
    const matchesLocation = job => selectedLocation.length === 0 || selectedLocation.includes(job.location);
    const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
    const matchesLoc = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs.slice().reverse().filter(
      job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesLoc(job)
    );
    setFilteredJob(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocation, searchFilter]);

  return (
    <div className="w-full flex">
      {/* Left Sidebar */}
      <div className={`w-full sm:w-[300px] bg-white shadow-lg rounded-xl px-6 py-6 ml-4 ${isFilterVisible ? 'block' : 'hidden sm:block'}`}>
        {isSearch && (searchFilter.title !== '' || searchFilter.location !== '') && (
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Current Search</h3>
            <div className="flex flex-wrap gap-4">
              {searchFilter.title && (
                <div className="bg-purple-100 text-black px-4 py-2 rounded-md flex items-center gap-2">
                  <span>{searchFilter.title}</span>
                  <img
                    src={cross}
                    alt="Clear"
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => clearFilter('title')}
                  />
                </div>
              )}
              {searchFilter.location && (
                <div className="bg-blue-100 text-black px-4 py-2 rounded-md flex items-center gap-2">
                  <span>{searchFilter.location}</span>
                  <img
                    src={cross}
                    alt="Clear"
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => clearFilter('location')}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-6">
          <h4 className="text-base sm:text-lg font-medium mb-3">Search by Categories</h4>
          <ul className="flex flex-col gap-y-3">
            {JobCategories.map((cat, index) => (
              <li key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox accent-purple-600"
                  onChange={() => handleCategoryChange(cat)}
                  checked={selectedCategories.includes(cat)}
                />
                <label className="text-sm text-gray-800">{cat}</label>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filters */}
        <div>
          <h4 className="text-base sm:text-lg font-medium mb-3 pt-14">Search by Location</h4>
          <ul className="flex flex-col gap-y-3">
            {JobLocations.map((location, index) => (
              <li key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox accent-blue-600"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocation.includes(location)}
                />
                <label className="text-sm text-gray-800">{location}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <button
          onClick={toggleFilterVisibility}
          className="sm:hidden bg-purple-600 text-white px-4 py-2 rounded-md mb-4 focus:outline-none"
        >
          {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </button>

        <section className="text-gray-800 max-lg:px-4">
          <h3 className="font-medium text-3xl py-2" id="job-list">Latest Jobs</h3>
          <p className="mb-8">Get your desired jobs from top companies</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:gap-3 gap-4">
            {filteredJob.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
              <JobCart key={index} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {filteredJob.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <a href="#job-list" className="p-2 hover:bg-gray-100 rounded-full transition">
                <img
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  src={lefticon}
                  alt="Previous"
                  className="h-6 w-6"
                />
              </a>
              {Array.from({ length: Math.ceil(filteredJob.length / 6) }).map((_, index) => (
                <a href="#job-list" key={index}>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      currentPage === index + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </a>
              ))}
              <a href="#job-list" className="p-2 hover:bg-gray-100 rounded-full transition">
                <img
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJob.length / 6)))}
                  src={righticon}
                  alt="Next"
                  className="h-6 w-6"
                />
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobListing;
