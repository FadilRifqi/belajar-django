import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

function Settings() {
  return (
    <Layout>
      <Helmet>
        <title>Buyee | Settings</title>
      </Helmet>
      <motion.div
        className="w-full h-[80vh] flex flex-col lg:flex-row items-center lg:items-start justify-center p-4 m-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* Form Container */}
        <motion.div
          className="w-full h-[80%] lg:w-3/4 bg-white rounded-lg shadow-md p-6 mt-4 lg:mt-0 flex-grow lg:mr-4 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        </motion.div>

        {/* Sidebar */}
        <Sidebar />
      </motion.div>
    </Layout>
  );
}

export default Settings;
