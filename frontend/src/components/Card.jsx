import PropTypes from "prop-types";

function Card({ title, content, price }) {
  return (
    <div className="bg-white p-4 rounded min-h-52 shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700">{content}</p>
      <p className="text-gray-700">Rp. {price}</p>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default Card;
