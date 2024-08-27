import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import LoadingComponent from "./LoadingComponent";

function CardList({ products, loading }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const handleReviewChange = (event) => {
    setReviewFilter(event.target.value);
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
    <section
      ref={sectionRef}
      className={`px-3 py-6 min-h-[40vh] transition-opacity duration-1000 ease-in-out rounded ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
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
            <div className="flex  justify-center items-center">
              <LoadingComponent />
            </div>
          ) : products.length !== 0 ? (
            products.map((card) => (
              <Card
                image={card.image}
                id={card.id}
                key={card.id}
                title={card.name}
                content={card.description}
                price={card.variants[0]?.price || 0}
              />
            ))
          ) : (
            <div className="w-full h-full text-center text-red-500">
              <h2 className="text-2xl font-bold">Internal Server Error</h2>
              <p className="mt-2 text-lg">Please try again later.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CardList;
