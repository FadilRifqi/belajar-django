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
      className={`bg-white rounded min-h-52 transition-all duration-700 ease-in-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="">
        <img
          src="https://via.placeholder.com/150"
          alt="placeholder"
          className="w-full h-60 object-cover rounded"
        />
      </div>
      <div className="p-4 text-center ">
        <p className="font-semibold mb-2 text-gray-400">{title}</p>
        <hr />
        <br />
        <p className="text-gray-400">
          {content} Rp. {price}
        </p>
        <Button onClick={() => alert("Buy")}>Buy</Button>
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
