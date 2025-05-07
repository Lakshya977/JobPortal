import React, { useContext } from 'react';
import logo from '../assets/logo.svg';
import { SignInButton, SignedOut, SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import AppContext from '../context/AppContext';

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { setrecruiterlogin } = useContext(AppContext);

  return (
    <nav className="shadow-md bg-white px-6 py-4" aria-label="Main Navigation">
      <div className="container mx-auto flex justify-between items-center pl-4">
        <div className="text-xl font-semibold text-gray-800">
          <img
            onClick={() => navigate('/')}
            src={assets.logo}
            alt="Job Factory Logo"
            className="h-10 w-auto cursor-pointer"
          />
        </div>

        <div className="flex gap-6 items-center">
          <SignedOut>
            <button
              onClick={() => setrecruiterlogin(true)}
              className="text-gray-600 hover:text-blue-600 transition duration-300"
            >
              Recruiter Login
            </button>
            <SignInButton
              mode="modal"
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Login
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link to="/applications" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Applied Jobs
            </Link>
            <span className="text-gray-500">|</span>

            {/* User Greeting */}
            {user && (
              <p className="text-gray-700 font-medium">
                Hi, {user.firstName} {user.lastName}
              </p>
            )}

            {/* User Button (for logout or profile access) */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
