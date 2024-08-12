import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 64) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="w-full">
      <nav
        className={`flex justify-between transition-colors items-center p-4 px-8 fixed top-0 ${
          scrolled
            ? "bg-white shadow-md w-[96%] left-1/2  -translate-x-1/2 mt-4 rounded-md"
            : "min-w-full"
        }`}
      >
        {" "}
        <div className="text-gray-700 text-lg font-light">
          <Link to={"/"} className="underline hover:no-underline">
            BUYEE
          </Link>
        </div>
        <div className="text-gray-700 text-lg font-light flex justify-between gap-4">
          <Link to={"/profile"} className="underline hover:no-underline">
            Profile
          </Link>
          <Link to={"/cart"} className="underline hover:no-underline">
            <FontAwesomeIcon icon={faCartShopping} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default NavigationBar;
