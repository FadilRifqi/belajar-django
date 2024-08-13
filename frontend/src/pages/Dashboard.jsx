import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import { motion } from "framer-motion";
import { Bar, Radar, Pie } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { topProducts, barData, barOptions, statsCards } from "../api/dummy.js";
import api from "../api";
import {
  CreateModals,
  DeleteModals,
  EditModals,
} from "../components/Modals.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  PointElement,
  LineElement
);

Modal.setAppElement("#root");

function Dashboard() {
  const barChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [error, setError] = useState(null);

  const [createModal, setCreateModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/api/products/list/");
        setProducts(res.data.results);
        console.log("Products: ", res.data.results);
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      }
    }
    fetchProducts();
    return () => {
      if (barChartRef.current) barChartRef.current.destroy();
      if (radarChartRef.current) radarChartRef.current.destroy();
      if (pieChartRef.current) pieChartRef.current.destroy();
    };
  }, [loading]);

  const openCreateModal = () => {
    setName("");
    setCategory("");
    setPrice(0);
    setCreateModalIsOpen(true);
  };
  const closeCreateModal = () => setCreateModalIsOpen(false);

  const openEditModal = (product) => {
    setId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);

  const openDeleteModal = (product) => {
    setId(product.id);
    setDeleteModalIsOpen(true);
  };
  const closeDeleteModal = () => setDeleteModalIsOpen(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);

    if (selectedImage) {
      formData.append("image", selectedImage); // Append the file to FormData
    }
    e.preventDefault();
    try {
      const res = await api.post("/api/products/", formData);
      toast.success("Product created successfully!");
      setCreateModalIsOpen(false);
    } catch (error) {
      toast.error("Error creating Product: " + error.message);
    } finally {
      setLoading(false);
    }
    closeModal();
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    try {
      const res = await api.patch(`/api/products/edit/${id}/`, formData);
      toast.success("Product updated successfully!");
      setEditModalIsOpen(false);
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    setLoading(true);
    try {
      const res = await api.delete(`/api/products/delete/${id}/`);
      toast.success("Product deleted successfully!");
      setDeleteModalIsOpen(false);
    } catch (error) {
      console.log("Error: ", error);

      toast.error("Error deleting product: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Buyee | Dashboard</title>
      </Helmet>
      <div className="p-6 min-h-screen">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Dashboard
          </h1>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <motion.div
              key={index}
              className={`${card.bgColor} p-6 rounded-lg shadow-lg cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-700">
                {card.title}
              </h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {card.value}
              </p>
              <p className={`mt-1 text-sm ${card.textColor}`}>{card.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Revenue
            </h2>
            <div className="h-64  rounded-lg flex items-center justify-center">
              <Bar ref={barChartRef} data={barData} options={barOptions} />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Top Products
            </h2>
            <ul>
              {topProducts.map((product, index) => (
                <li key={index} className="mb-2">
                  <div className="flex justify-between">
                    <span>{product.name}</span>
                    <span>{product.percentage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className={`${product.color} h-2.5 rounded-full`}
                      style={{ width: product.percentage }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Sales by Region & Platform */}
        <div className="flex min-w-full gap-4 rounded-lg shadow-lg">
          {/* All Products Card with Add Product Button */}
          <motion.div
            className="p-6 items-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              All Products
            </h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={openCreateModal}
            >
              Add New Product
            </button>
            <div
              className={`${
                products.length === 0
                  ? "flex justify-center items-center"
                  : "mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6 justify-items-center items-center"
              }`}
            >
              {products.length > 0 ? (
                products.map((product, key) => {
                  return (
                    <div className="max-w-sm min-h-[20rem] rounded overflow-hidden shadow-lg flex flex-col">
                      <img
                        className="w-full max-h-[10rem] object-fill"
                        src={product.image}
                        alt={product.name}
                      />
                      <div className="px-6 py-4 mt-auto">
                        <div className="font-bold text-xl mb-2">
                          {product.name}
                        </div>
                        <p className="text-gray-700 text-base">
                          Category: {product.category}
                        </p>
                        <p className="text-gray-700 text-base">
                          Price: ${product.price}
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => openEditModal(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => openDeleteModal(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-700">
                  You Have No Products
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <CreateModals
          handleCategory={handleCategory}
          handleFileChange={handleFileChange}
          handleFormSubmit={handleFormSubmit}
          handleName={handleName}
          handlePrice={handlePrice}
          closeModal={closeCreateModal}
          createModal={createModal}
          name={name}
          category={category}
          price={price}
        />
        <EditModals
          editModalisOpen={editModalIsOpen}
          closeModal={closeEditModal}
          handleFormSubmit={handleEdit}
          handleName={handleName}
          handleCategory={handleCategory}
          handlePrice={handlePrice}
          handleFileChange={handleFileChange}
          name={name}
          category={category}
          price={price}
        />
        <DeleteModals
          modalIsOpen={deleteModalIsOpen}
          closeModal={closeDeleteModal}
          handleDelete={handleDelete}
        />
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default Dashboard;
