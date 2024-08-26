import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import Carousel from "../components/Carousel";
import CardList from "../components/CardList";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/products/list/all/"
        );
        setProducts(res.data.results);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <Layout>
      <Helmet>
        <title>Buyee | Home</title>
      </Helmet>
      <Carousel />
      <CardList products={products} loading={loading} />
    </Layout>
  );
}

export default Home;
