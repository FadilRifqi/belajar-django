import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import Sidebar from "../components/Sidebar";
import { useEffect, useRef, useState } from "react";

function Profile() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  return (
    <Layout>
      <Helmet>
        <title>Buyee | Profile</title>
      </Helmet>
      <div
        ref={containerRef}
        className={`w-full h-[80vh] flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 transition-all duration-700 ease-in-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Form Container */}
        <div className="w-full min-h-[80%] lg:w-3/4 bg-white rounded-lg shadow-md p-6 mt-4 lg:mt-0 flex-grow lg:mr-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Profile Settings
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your email"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your password"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="shadow border-red-600 border px-4 py-2 bg-white text-black font-semibold rounded-lg hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
                  sm:px-4 sm:py-2 sm:text-sm
                  md:px-6 md:py-3 md:text-base
                  lg:px-8 lg:py-4 lg:text-lg"
              >
                Cancel
              </button>
              <button
                className="shadow border-blue-400 border px-4 py-2 bg-white text-black font-semibold rounded-lg hover:text-white focus:text-white focus:bg-blue-400 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
                  sm:px-4 sm:py-2 sm:text-sm
                  md:px-6 md:py-3 md:text-base
                  lg:px-8 lg:py-4 lg:text-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </Layout>
  );
}

export default Profile;
