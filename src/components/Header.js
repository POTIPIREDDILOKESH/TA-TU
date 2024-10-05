import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full mt-5 text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
      <div className="container flex flex-col items-start justify-between p-6 mx-auto md:flex-row">
        <Link to="/" className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0">
          {/* Logo image removed */}
          <span className="text-2xl font-bold">Turn</span> {/* Added text as logo */}
        </Link>
        <nav className="flex flex-wrap items-center justify-center pl-6 ml-6 text-base border-l border-gray-200 md:mr-auto">
          <Link to="/" className="mr-5 font-medium hover:text-gray-900">Home</Link>
          <Link to="/about" className="mr-5 font-medium hover:text-gray-900">About</Link>
          <Link to="/book" className="font-medium hover:text-gray-900">Book Your Table</Link>
        </nav>
        <div className="items-center h-full">
          <Link to="/login" className="mr-5 font-medium hover:text-gray-900">Login</Link>
          <Link to="/signup" className="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-teal-500 rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
