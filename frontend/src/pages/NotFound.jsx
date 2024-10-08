import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <Layout>
      <Helmet>
        <title>Buyee | 404</title>
      </Helmet>
      <div className="flex justify-center items-center w-full h-[80vh]">
        <motion.h1
          className="text-4xl text-center text-red-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          404 Not Found
        </motion.h1>
      </div>
    </Layout>
  );
}

export default NotFound;
