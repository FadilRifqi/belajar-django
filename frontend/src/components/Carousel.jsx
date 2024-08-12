import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "../assets/css/carousel.css";

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
      className={`p-2 w-full pb-0 max-h-96 mb-0 md:mb-2 xl:mb-2 transform transition-all duration-700 ease-in-out ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <Swiper
        spaceBetween={50}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="max-h-96"
      >
        <SwiperSlide>
          <img
            src="https://via.placeholder.com/800x400"
            alt="Slide 1"
            className="w-full max-h-96 object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://via.placeholder.com/800x400"
            alt="Slide 2"
            className="w-full max-h-96 object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://via.placeholder.com/800x400"
            alt="Slide 3"
            className="w-full max-h-96 object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://via.placeholder.com/800x400"
            alt="Slide 4"
            className="w-full max-h-96 object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default Carousel;
