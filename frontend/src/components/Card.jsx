import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Button from "./Button";

const variants = {
  hidden: { opacity: 0, translateY: 20 },
  visible: { opacity: 1, translateY: 0 },
};

function Card({ title, price, image }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={variants}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
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
      <div className="mt-auto px-1 pb-1 sm:p-3 md:p-4 lg:p-6">
        <Button className="w-full" onClick={() => alert("Buy")}>
          Buy
        </Button>
      </div>
    </motion.div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default Card;
