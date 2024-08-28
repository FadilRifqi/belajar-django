import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Card from "./Card";
import LoadingComponent from "./LoadingComponent";

function CardList({ products, loading, setProducts }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReviewFilter(event.target.value);
  };

  const loadMore = async () => {
    setIsLoadingMore(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/list/all/?page=${page + 1}`
      );
      setProducts((prevProducts) => [...prevProducts, ...res.data.results]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="px-3 py-6 min-h-[40vh] rounded"
    >
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col w-full sm:w-auto">
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="p-2 border border-gray-300 rounded-md text-sm "
          >
            <option>Category</option>
            {/* Add your category options here */}
          </select>
        </div>
        <div className="flex flex-col w-full sm:w-auto">
          <select
            id="priceFilter"
            value={priceFilter}
            onChange={handlePriceChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
          >
            <option>Price</option>
          </select>
        </div>
        <div className="flex flex-col w-full sm:w-auto">
          <select
            id="reviewFilter"
            value={reviewFilter}
            onChange={handleReviewChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
          >
            <option>Review</option>
          </select>
        </div>
      </div>
      <div className="">
        <div
          className={`${
            loading || products.length === 0
              ? "flex h-full min-h-[20vh] flex-col justify-center items-center"
              : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6"
          }`}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <LoadingComponent />
            </div>
          ) : products.length !== 0 ? (
            products.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  image={card.variants[0]?.images[0]?.image}
                  id={card.id}
                  title={card.name}
                  content={card.description}
                  price={card.variants[0]?.price || 0}
                />
              </motion.div>
            ))
          ) : (
            <div className="w-full h-full text-center text-red-500">
              <h2 className="text-2xl font-bold">Internal Server Error</h2>
              <p className="mt-2 text-lg">Please try again later.</p>
            </div>
          )}
        </div>
        {products.length !== 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default CardList;
