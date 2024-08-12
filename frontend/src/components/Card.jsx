import PropTypes from "prop-types";
import Button from "./Button";

function Card({ title, content, price }) {
  return (
    <div className="bg-white rounded min-h-52 ">
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
