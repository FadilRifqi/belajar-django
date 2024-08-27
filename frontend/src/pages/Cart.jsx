import { motion } from "framer-motion";
import Layout from "./layouts/Layout";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import api from "../api.js";

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function Cart() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res = await api.get("/products/random/");
        console.log(res.data.results);
        setProducts(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="min-h-[80vh] flex flex-col p-4"
      >
        <div className="w-full flex-grow-[1] mb-4">
          <h1 className="xl:text-3xl text-black font-semibold">Keranjang</h1>
        </div>
        <div className="flex flex-grow-[50] gap-4">
          {/* Left Section - Cart Items */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="md:w-3/4 bg-white rounded-md shadow-md p-6"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center bg-gray-100 rounded-md p-6"
            >
              <img
                src="link_to_empty_cart_image"
                alt="Empty Cart"
                className="mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Wah, keranjang belanjamu kosong
              </h2>
              <p className="text-gray-600 mb-4">
                Yuk, isi dengan barang-barang impianmu!
              </p>
              <button className="bg-green-500 text-white py-2 px-4 rounded-md">
                Mulai Belanja
              </button>
            </motion.div>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Rekomendasi untukmu
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {products.map((card) => (
                  <Card
                    image={card.image}
                    id={card.id}
                    key={card.id}
                    title={card.name}
                    content={card.description}
                    price={card.variants[0]?.price || 0}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Section - Summary */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="w-1/4 bg-white rounded-md shadow-md p-6 sticky top-20 md:h-[40vh] hidden md:flex flex-col justify-between"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Ringkasan Belanja
            </h2>
            <p className="text-gray-600">Total</p>
            <p className="text-gray-800 font-bold text-xl mb-4">-</p>
            <div className="bg-green-100 text-green-600 p-2 rounded-md mb-4">
              <p>Makin hemat pakai promo</p>
            </div>
            <button className="bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
              Beli
            </button>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}

export default Cart;
