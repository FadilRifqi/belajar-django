import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import Carousel from "../components/Carousel";
import CardList from "../components/CardList";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + `/products/list/all/?page=${page}`
        );

        setProducts(res.data.results);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <Layout>
      <Helmet>
        <title>Buyee | Home</title>
      </Helmet>
      <Carousel />
      <CardList
        products={products}
        loading={loading}
        setProducts={setProducts}
      />
    </Layout>
  );
}

export default Home;
