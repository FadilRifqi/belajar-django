import { Helmet } from "react-helmet";
import Layout from "./layouts/Layout";
import { useEffect, useRef, useState } from "react";

function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  const notFoundRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (notFoundRef.current) {
      observer.observe(notFoundRef.current);
    }

    return () => {
      if (notFoundRef.current) {
        observer.unobserve(notFoundRef.current);
      }
    };
  }, []);
  return (
    <Layout>
      <Helmet>
        <title>Buyee | 404</title>
      </Helmet>
      <div
        ref={notFoundRef}
        className={`flex justify-center items-center w-full h-[80vh] transition-all duration-700 ease-in-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-4xl text-center text-gray-400">404 Not Found</h1>
      </div>
    </Layout>
  );
}

export default NotFound;
