import PropTypes from "prop-types";

function Button({ children, onClick }) {
  return (
    <button
      className="m-2 w-full px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-75"
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
