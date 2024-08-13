import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import Sidebar from "../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constant";
import AuthContext from "../components/AuthContext";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

function Profile() {
  const decodedToken = useContext(AuthContext);
  const { username, email, profile_picture } = decodedToken;

  const [deleteImage, setDeleteImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(profile_picture); // State untuk pratinjau gambar

  useEffect(() => {
    async function toastShow() {
      if (sessionStorage.getItem("profileUpdateSuccess") === "true") {
        await toast.success("Profile updated successfully!");
        sessionStorage.removeItem("profileUpdateSuccess");
      }
    }
    toastShow();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const fileInput = document.getElementById("image");

    if (!fileInput.files.length && deleteImage) {
      formData.set("profile_picture", "");
    } else if (!fileInput.files.length) {
      formData.delete("profile_picture");
    }

    try {
      const res = await api.patch("/api/user/edit/", formData);

      if (res.data.access && res.data.refresh) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      }

      sessionStorage.setItem("profileUpdateSuccess", "true");
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.email) {
        toast.error("Error updating profile: " + error.response.data.email[0]);
      } else if (error.response.data.username) {
        toast.error(
          "Error updating profile: " + error.response.data.username[0]
        );
      } else if (error.response.data.profile_picture) {
        toast.error(
          "Error updating profile: " + error.response.data.profile_picture[0]
        );
      } else {
        toast.error("Error updating profile ");
      }
    }
  };

  const handleDeleteImage = () => {
    setDeleteImage(true);
    setPreviewImage(null); // Hapus pratinjau gambar
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Set pratinjau gambar baru
      setDeleteImage(false); // Reset state hapus gambar
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Buyee | Profile</title>
      </Helmet>
      <ToastContainer position="bottom-right" />
      <motion.div
        className="w-full min-h-[80vh] flex flex-col lg:flex-row items-center lg:items-start justify-center p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="w-full h-full lg:w-3/4 bg-white rounded-lg shadow-md p-6 mt-28 md:mt-0 lg:mt-0 flex-grow lg:mr-4 z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Profile Settings
          </h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                name="username"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={username}
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
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={email}
                placeholder="Your email"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Image
              </label>
              <input
                type="file"
                id="image"
                name="profile_picture"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-xs custom-file-input"
                onChange={handleImageChange} // Event handler untuk perubahan gambar
              />
              {previewImage && (
                <motion.div
                  className="flex justify-center items-center mt-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    className="ml-4 h-9 w-9 bg-red-500 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                    onClick={handleDeleteImage}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </motion.div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="shadow text-sm border-red-600 border px-4 py-2 bg-white text-black font-semibold rounded-lg hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
                  sm:px-4 sm:py-2 
                  md:px-6 md:py-3 
                  lg:px-12 lg:py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="shadow text-sm border-blue-400 px-4 py-2 border bg-white text-black font-semibold rounded-lg hover:text-white focus:text-white focus:bg-blue-400 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
                  sm:px-4 sm:py-2 
                  md:px-8 md:py-3 
                  lg:px-12 lg:py-3"
              >
                Update
              </button>
            </div>
          </form>
        </motion.div>

        <Sidebar />
      </motion.div>
    </Layout>
  );
}

export default Profile;
