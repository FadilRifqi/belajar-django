import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Layout from "../../layouts/Layout";

const InternalServerError = ({ error }) => {
  return (
    <Layout>
      <Helmet>
        <title>Buyee | {error.response.status.toString()}</title>
      </Helmet>
      <div className="flex justify-center items-center w-full h-[80vh]">
        <motion.h1
          className="text-4xl text-center text-red-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {error.response.status == 404
            ? "404 Not Found"
            : "500 Internal Server Error"}
        </motion.h1>
      </div>
    </Layout>
  );
};

export default InternalServerError;
