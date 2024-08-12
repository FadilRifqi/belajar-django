import { useEffect, useRef, useState } from "react";
import Card from "./Card";
import PropTypes from "prop-types";

function CardList({ cardData }) {
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
        threshold: 0.1, // Trigger when 10% of the section is in view
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
      className={`p-2 transition-opacity duration-1000 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-wrap gap-4 mb-2 md:mb-2 xl:mb-2">
        <div className="flex flex-col w-full sm:w-auto">
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="p-2 border border-gray-300 rounded-md text-sm "
          >
            <option selected>Category</option>
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
            <option selected>Price</option>
          </select>
        </div>
        <div className="flex flex-col w-full sm:w-auto">
          <select
            id="reviewFilter"
            value={reviewFilter}
            onChange={handleReviewChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none"
          >
            <option selected>Review</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
        {cardData.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            content={card.content}
            price={card.price}
          />
        ))}
      </div>
    </section>
  );
}

CardList.propTypes = {
  cardData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CardList;
