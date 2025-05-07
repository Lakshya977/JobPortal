import React from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import JobListing from '../Components/JobListing';
import Appdownload from '../Components/appdownload';
import Footer from '../Components/Footer';
const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <Hero />
      <JobListing />
      <Appdownload />
      <Footer></Footer>
    </div>
  );
};

export default Home;