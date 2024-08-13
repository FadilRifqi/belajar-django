import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import "../assets/css/carousel.css";
import carousel1 from "../assets/images/carousel1.webp";
import carousel2 from "../assets/images/carousel2.webp";
import carousel3 from "../assets/images/carousel3.webp";
import carousel4 from "../assets/images/carousel4.webp";

function Carousel() {
  const [isLoaded, setIsLoaded] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={carouselRef}
      className={`p-4 mt-4 mb-2 w-full pb-0 h-[20vh] md:h-96 transform transition-all duration-700 ease-in-out ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <Swiper
        spaceBetween={50}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="md:h-96 h-[20vh] rounded"
      >
        <SwiperSlide>
          <img
            src={carousel1}
            alt="Slide 1"
            className="w-full md:h-96 h-[20vh] object-fill md:object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={carousel2}
            alt="Slide 2"
            className="w-full md:h-96 h-[20vh] object-fill md:object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={carousel3}
            alt="Slide 3"
            className="w-full md:h-96 h-[20vh] object-fill md:object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={carousel4}
            alt="Slide 4"
            className="w-full h-[20vh] md:h-96 object-fill md:object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default Carousel;
