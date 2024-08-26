import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const variants = {
  hidden: { opacity: 0, translateY: 20 },
  visible: { opacity: 1, translateY: 0 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  click: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

function Card({ title, price, image, id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      whileTap="click"
      onClick={handleClick}
      viewport={{ once: true, amount: 0.1 }}
      variants={variants}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:cursor-pointer"
    >
      <div className="w-full sm:h-24 md:h-48 lg:h-64">
        <img
          src={image ? image : "https://via.placeholder.com/150"}
          alt="placeholder"
          className="w-full max-h-full object-fill"
        />
      </div>
      <div className="sm:p-3 md:p-4 lg:p-6 flex-grow">
        <p className="font-semibold mb-2 text-gray-700 text-base text-center">
          {title}
        </p>
        <hr className="border-gray-300 sm:my-3 md:my-4 lg:my-6" />
        <p className="text-gray-600 text-xs text-center">
          <span className="font-medium">Rp. {price}</span>
        </p>
      </div>
    </motion.div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  image: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default Card;
