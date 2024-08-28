import Modal from "react-modal";

export function CreateModals({
  createModal,
  closeModal,
  handleFormSubmit,
  handleName,
  handleCategory,
  name,
  variants,
  setVariants,
  handleFileChange,
  handleVariantChange,
  addVariant,
  removeVariant,
  category,
  description,
  handleDescription,
}) {
  return (
    <Modal
      isOpen={createModal}
      onRequestClose={closeModal}
      className="bg-white p-6 rounded-lg shadow-lg min-w-1/2 md:w-1/2 mx-auto max-h-screen overflow-y-auto"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Add New Product
      </h2>
      <form onSubmit={(e) => handleFormSubmit(e, variants)}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nama Produk
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleName}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Kategori
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={handleCategory}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={handleDescription}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {variants.map((variant, index) => (
          <div key={index} className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={`variantName-${index}`}
            >
              Warna
            </label>
            <input
              type="text"
              id={`variantName-${index}`}
              name="name"
              value={variant.name}
              onChange={(e) => handleVariantChange(index, e)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={`variantPrice-${index}`}
            >
              Harga
            </label>
            <input
              type="text"
              id={`variantPrice-${index}`}
              name="price"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, e)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={`variantStock-${index}`}
            >
              Stok
            </label>
            <input
              type="text"
              id={`variantStock-${index}`}
              name="stock"
              value={variant.stock}
              onChange={(e) => handleVariantChange(index, e)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor={`variantImage-${index}`}
            >
              Gambar
            </label>
            <input
              type="file"
              id={`variantImage-${index}`}
              name="image"
              onChange={(e) => handleVariantChange(index, e)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 mt-2"
            >
              Hapus Variant
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 mb-4"
        >
          Tambah Variant
        </button>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            Tambah Produk
          </button>
          <button
            type="button"
            onClick={() => {
              closeModal(createModal);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function EditModals({
  editModalisOpen,
  closeModal,
  handleFormSubmit,
  handleName,
  handleCategory,
  handlePrice,
  handleFileChange,
  name,
  category,
  price,
}) {
  return (
    <Modal
      isOpen={editModalisOpen}
      onRequestClose={closeModal}
      className="bg-white p-6 rounded-lg shadow-lg min-w-1/2 md:w-1/2 mx-auto"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Edit Product
      </h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleName}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={handleCategory}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="price"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={handlePrice}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function DeleteModals({ modalIsOpen, closeModal, handleDelete }) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="bg-white p-6 rounded-lg shadow-lg min-w-1/3 md:w-1/3 mx-auto"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Confirm Deletion
      </h2>
      <p className="text-gray-700 mb-4">
        Are you sure you want to delete this product?
      </p>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
