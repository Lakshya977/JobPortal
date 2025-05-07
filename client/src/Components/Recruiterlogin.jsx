import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import AppContext from '../context/AppContext';

const Recruiterlogin = () => {
  
  const [mode, setMode] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null); // for step 2 signup
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  
  const {setrecruiterlogin} = useContext(AppContext)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'Sign Up') {
      if (!isTextDataSubmitted) {
        if (!name || !email || !password) {
          alert('Please fill all fields');
          return;
        }
        setIsTextDataSubmitted(true);
        return;
      }
      if (!image) {
        alert('Please upload a company logo');
        return;
      }

      console.log('Sign Up Done', { name, email, password, image });
      
      return;
    }

    // Login logic here
    console.log('Login', { email, password });
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-md w-full p-8 bg-white bg-opacity-90 rounded-xl shadow-lg"
      >
       
        <div className="mb-4">
          <img
            src={assets.left_arrow_icon}
            alt="Back"

            onClick={()=> {setrecruiterlogin(false)}}
            className="w-6 h-6 cursor-pointer"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Recruiter {mode}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {mode === 'Login'
            ? 'Please log in to continue'
            : isTextDataSubmitted
            ? 'Upload your company logo'
            : 'Please sign up to continue'}
        </p>

        
        {!(mode === 'Sign Up' && isTextDataSubmitted) && (
          <>
            {mode === 'Sign Up' && (
              <div className="flex items-center mb-4 border-b-2 border-gray-300">
                <img src={assets.person_icon} alt="" className="w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 text-gray-700 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center mb-4 border-b-2 border-gray-300">
              <img src={assets.email_icon} alt="" className="w-5 h-5 mr-3" />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center mb-6 border-b-2 border-gray-300">
              <img src={assets.lock_icon} alt="" className="w-5 h-5 mr-3" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 focus:outline-none"
              />
            </div>
          </>
        )}

       
        {mode === 'Sign Up' && isTextDataSubmitted && (
          <div className="mb-6 flex items-center">
            <label className="block text-gray-700 mb-2">Upload Company Logo</label>
            <img  src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-gray-500"
            />
          </div>
        )}

        {mode === 'Login' && (
          <button className="text-blue-600 mb-4 hover:text-blue-800 text-sm">
            Forgot Password?
          </button>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {mode === 'Login'
            ? 'Login'
            : isTextDataSubmitted
            ? 'Create Account'
            : 'Next'}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'Login' ? 'Sign Up' : 'Login');
              setIsTextDataSubmitted(false); // Reset when switching modes
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {mode === 'Login'
              ? 'New to us? Create an account'
              : 'Already have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Recruiterlogin;
