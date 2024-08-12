import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";

function NotFound() {
  return (
    <Layout>
      <Helmet>
        <title>Buyee | 404</title>
      </Helmet>
      <div className="flex justify-center items-center w-full h-[80vh]">
        <h1 className="text-4xl text-center text-gray-400">404 Not Found</h1>
      </div>
    </Layout>
  );
}

export default NotFound;
