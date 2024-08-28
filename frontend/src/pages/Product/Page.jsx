import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import Layout from "../layouts/Layout";
import LoadingComponent from "../../components/LoadingComponent";
import InternalServerError from "../Error/InternalServerError/Page";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let res = await api.get("/products/" + id + "/");
        setProduct(res.data);
        console.log(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <Layout>
        <LoadingComponent />
      </Layout>
    );
  if (error) return <InternalServerError error={error} />;

  const dummyImage =
    "https://via.placeholder.com/400x300?text=No+Image+Available";

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      currentImageIndex === 0
        ? product.variants.length - 1
        : currentImageIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      currentImageIndex === product.variants.length - 1
        ? 0
        : currentImageIndex + 1
    );
  };

  const getPriceRange = (variants) => {
    if (!variants || variants.length === 0) return null;
    const prices = variants.map((variant) => variant.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { minPrice, maxPrice };
  };

  const priceRange = getPriceRange(product.variants);

  return (
    <Layout>
      {product ? (
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {product.name}
          </h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 relative">
              <button
                onClick={handlePreviousImage}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black p-2 rounded-full shadow-md hover:bg-gray-400 hover:text-gray-700 focus:outline-none transition-transform duration-300 ease-in-out hover:scale-110"
              >
                &lt;
              </button>
              <img
                src={
                  product.variants[currentImageIndex].images[0]?.image ||
                  dummyImage
                }
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black p-2 rounded-full shadow-md hover:bg-gray-400 hover:text-gray-700 focus:outline-none transition-transform duration-300 ease-in-out hover:scale-110"
              >
                &gt;
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-xl mb-4 text-gray-700">
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              <p className="text-lg mb-4 text-gray-600">
                <span className="font-semibold">Description:</span>{" "}
                {product.description}
              </p>
              {priceRange && (
                <p className="text-2xl font-bold text-red-600 mb-4">
                  ${priceRange.minPrice} - ${priceRange.maxPrice}
                </p>
              )}
              {product.discount && (
                <p className="text-lg text-gray-500 line-through mb-4">
                  ${product.originalPrice}
                </p>
              )}
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-transform duration-300 ease-in-out">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600">Product not found.</p>
      )}
    </Layout>
  );
}

export default Product;
