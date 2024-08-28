import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
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
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([
    { name: "", price: "", images: [{ image: null }], stock: "" },
  ]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [createModal, setCreateModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const handleVariantChange = (index, event) => {
    const { name, value, files } = event.target;
    const newVariants = [...variants];

    if (name === "image") {
      newVariants[index].images["image"] = files[0];
    } else {
      newVariants[index][name] = value;
    }
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "", price: "", images: [{ image: null }], stock: "" },
    ]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

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
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products/list/");
        setProducts(res.data.results);
        console.log("Products: ", res.data.results);
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      }
    }
    fetchProducts();
  }, [loading]);

  const openCreateModal = () => {
    setName("");
    setCategory("");
    setDescription("");
    setPrice(0);
    setVariants([
      { name: "", price: "", images: [{ image: null }], stock: "" },
    ]);
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
    const productData = {
      name,
      category,
      description,
      variants,
    };

    console.log("Product Data: ", productData);

    try {
      // Create the product first
      const res = await api.post("/products/", productData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const createdProduct = res.data;
      console.log(createdProduct);
      toast.success("Product created successfully!");

      // Patch each variant image

      await Promise.all(
        variants.map(async (variant, index) => {
          console.log("Variant", variant);

          try {
            console.log(variant["images"]["image"]);

            const formData = new FormData();
            formData.append("image", variant["images"]["image"]);
            console.log("Image: ", variant["images"]["image"]);
            console.log(
              "created product ",
              createdProduct.variants[index].images[0].id
            );

            const res = await api.patch(
              `/products/variants/${createdProduct.variants[index].images[0].id}/`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Image uploaded: ", res.data);
          } catch (error) {
            console.log("Error uploading image: ", error);
          }
        })
      );

      setCreateModalIsOpen(false);
    } catch (error) {
      console.error("Error creating product: ", error);
      toast.error("Error creating Product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const productData = {
      name,
      category,
      price,
      description,
      variants,
    };

    try {
      await api.patch(`/products/edit/${id}/`, productData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        await api.patch(`/products/upload-image/${id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

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
    e.preventDefault();
    try {
      await api.delete(`/products/delete/${id}/`);
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
                    <motion.div
                      className={`${product.color} h-2.5 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: product.percentage }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    ></motion.div>
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
                    <motion.div
                      key={key}
                      className="w-full min-h-[20rem] rounded overflow-hidden shadow-lg flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <img
                        className="w-full max-h-[10rem] object-fill"
                        src={product.variants[0].images[0].image}
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
                          <motion.button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => openEditModal(product)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => openDeleteModal(product)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                          >
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
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
          variants={variants}
          setVariants={setVariants}
          handleDescription={handleDescription}
          handleVariantChange={handleVariantChange}
          addVariant={addVariant}
          removeVariant={removeVariant}
          name={name}
          description={description}
          category={category}
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
      <ToastContainer position="bottom-right" />
    </Layout>
  );
}

export default Dashboard;
