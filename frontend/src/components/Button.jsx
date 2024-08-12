import PropTypes from "prop-types";

function Button({ children, onClick }) {
  return (
    <button
      className="w-full px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-75
             sm:w-full sm:px-6 sm:py-3 sm:text-sm
             md:w-full md:px-8 md:py-4 md:text-base
             lg:w-full lg:px-10 lg:py-5 lg:text-lg"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
