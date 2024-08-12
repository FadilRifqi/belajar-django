import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from "react";

function Settings() {
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
        <title>Buyee | Settings</title>
      </Helmet>
      <div
        ref={containerRef}
        className={`w-full h-[80vh] flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 transition-all duration-700 ease-in-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Form Container */}
        <div className="w-full h-[80%] lg:w-3/4 bg-white rounded-lg shadow-md p-6 mt-4 lg:mt-0 flex-grow lg:mr-4 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        </div>
        {/* Sidebar */}
        <Sidebar />
      </div>
    </Layout>
  );
}

export default Settings;
