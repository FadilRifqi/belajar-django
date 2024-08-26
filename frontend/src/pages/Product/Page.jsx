import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import Layout from "../layouts/Layout";
import LoadingComponent from "../../components/LoadingComponent";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let res = await api.get("/products/" + id + "/");
        setProduct(res.data);
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
  if (error) return <Layout>Error: {error.detail}</Layout>;

  const dummyImage =
    "https://via.placeholder.com/400x300?text=No+Image+Available";

  return (
    <Layout>
      {product ? (
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {product.name}
          </h1>
          <p className="text-xl mb-4 text-gray-700">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="text-lg mb-4 text-gray-600">
            <span className="font-semibold">Description:</span>{" "}
            {product.description}
          </p>
          <p className="text-lg mb-4 text-gray-600">
            <span className="font-semibold">Price:</span> ${product.price}
          </p>
          <div className="mb-6">
            <img
              src={product.image || dummyImage}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          <h2 className="text-2xl font-semibold mt-8 mb-6 text-gray-800">
            Variants
          </h2>
          {product.variants && product.variants.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {product.variants.map((variant) => (
                <li key={variant.id} className="text-lg">
                  {variant.name} - ${variant.price} - Stock: {variant.stock}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-600">No variants available.</p>
          )}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Product not found.</p>
      )}
    </Layout>
  );
}

export default Product;
