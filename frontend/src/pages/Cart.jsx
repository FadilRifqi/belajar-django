import { useState, useEffect, useRef } from "react";
import { cardData } from "../api/dummy";
import Card from "../components/Card";
import Layout from "./layouts/Layout";

function Cart() {
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [isEmptyCartVisible, setIsEmptyCartVisible] = useState(false);
  const rightRef = useRef(null);
  const emptyCartRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === rightRef.current && entry.isIntersecting) {
            setIsRightVisible(true);
            observer.unobserve(entry.target);
          }
          if (entry.target === emptyCartRef.current && entry.isIntersecting) {
            setIsEmptyCartVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (rightRef.current) {
      observer.observe(rightRef.current);
    }
    if (emptyCartRef.current) {
      observer.observe(emptyCartRef.current);
    }

    return () => {
      if (rightRef.current) {
        observer.unobserve(rightRef.current);
      }
      if (emptyCartRef.current) {
        observer.unobserve(emptyCartRef.current);
      }
    };
  }, []);

  return (
    <Layout>
      <div
        className={`min-h-[80vh] flex flex-col p-4 transition-all duration-700 ease-in-out transform ${
          isRightVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="w-full flex-grow-[1] mb-4">
          <h1 className="xl:text-3xl text-black font-semibold">Keranjang</h1>
        </div>
        <div className="flex flex-grow-[50] gap-4">
          {/* Left Section - Cart Items */}
          <div className="md:w-3/4 bg-white rounded-md shadow-md p-6">
            <div
              ref={emptyCartRef}
              className={`flex flex-col items-center justify-center bg-gray-100 rounded-md p-6 transition-all duration-700 ease-in-out transform ${
                isEmptyCartVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <img
                src="link_to_empty_cart_image"
                alt="Empty Cart"
                className="mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Wah, keranjang belanjamu kosong
              </h2>
              <p className="text-gray-600 mb-4">
                Yuk, isi dengan barang-barang impianmu!
              </p>
              <button className="bg-green-500 text-white py-2 px-4 rounded-md">
                Mulai Belanja
              </button>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Rekomendasi untukmu
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {cardData.map((card) => (
                  <Card
                    key={card.id}
                    title={card.title}
                    content={card.content}
                    price={card.price}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div
            ref={rightRef}
            className="w-1/4 bg-white rounded-md shadow-md p-6 sticky top-20 md:h-[40vh] hidden md:flex flex-col justify-between"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Ringkasan Belanja
            </h2>
            <p className="text-gray-600">Total</p>
            <p className="text-gray-800 font-bold text-xl mb-4">-</p>
            <div className="bg-green-100 text-green-600 p-2 rounded-md mb-4">
              <p>Makin hemat pakai promo</p>
            </div>
            <button className="bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
              Beli
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
