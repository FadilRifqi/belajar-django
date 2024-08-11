import { useState } from "react";
import { Link } from "react-router-dom";

function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">MyApp</Link>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
          <Link to="/services" className="text-gray-300 hover:text-white">
            Services
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/about" className="block text-gray-300 hover:text-white">
              About
            </Link>
            <Link
              to="/services"
              className="block text-gray-300 hover:text-white"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="block text-gray-300 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;
