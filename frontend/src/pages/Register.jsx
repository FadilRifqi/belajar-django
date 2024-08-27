import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import LoadingComponent from "../components/LoadingComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await api.post("/user/register/", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        if (error.response.data.email) {
          toast.error(error.response.data.email[0]);
        } else if (error.response.data.username) {
          toast.error(error.response.data.username[0]);
        } else if (error.response.data.password) {
          toast.error(error.response.data.password[0]);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

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
        <title>Buyee | Register</title>
      </Helmet>
      <ToastContainer position="bottom-right" />
      <div className="flex justify-center items-center w-full h-[80vh]">
        <div
          ref={containerRef}
          className={`w-full max-w-md bg-white p-8 rounded-lg shadow-md transition-all duration-700 ease-in-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
              <LoadingComponent />
            </div>
          )}
          <h1 className="text-4xl text-center text-gray-700 mb-6">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Enter your username"
                onChange={handleUsernameChange}
                value={username}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleEmailChange}
                value={email}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={handlePasswordChange}
                value={password}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:bg-blue-500"
                type="submit"
              >
                Register
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                to={"/login"}
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Register;
