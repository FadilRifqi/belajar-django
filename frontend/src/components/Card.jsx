import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

function Card({ title, content, price }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-700 ease-in-out transform flex flex-col ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="w-full sm:h-24 md:h-48 lg:h-64">
        <img
          src="https://via.placeholder.com/150"
          alt="placeholder"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="sm:p-3 md:p-4 lg:p-6 flex-grow">
        <p className="font-semibold mb-2 text-gray-700 text-base text-center">
          {title}
        </p>
        <hr className="border-gray-300 sm:my-3 md:my-4 lg:my-6" />
        <p className="text-gray-600 text-xs text-center">
          {content} <span className="font-medium">Rp. {price}</span>
        </p>
      </div>
      <div className="mt-auto px-1 pb-1 sm:p-3 md:p-4 lg:p-6">
        <Button className="w-full" onClick={() => alert("Buy")}>
          Buy
        </Button>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Card;
