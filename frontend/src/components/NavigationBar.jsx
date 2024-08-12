import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="w-full flex justify-center">
      <nav
        className={`z-10 flex justify-between transition-all items-center p-4 px-8 fixed top-0 ${
          scrolled ? "bg-white shadow-md w-[96%] mt-4 rounded-md" : "w-full"
        }`}
      >
        <div className="text-gray-700 text-lg font-light">
          <Link to="/" className="no-underline hover:underline">
            BUYEE
          </Link>
        </div>
        <div className="md:flex flex flex-col">
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            id="navbar-default"
            className={`text-gray-700 text-lg font-light justify-between gap-4 ${
              menuOpen ? "block" : "hidden"
            } w-full md:flex md:w-auto`}
          >
            <ul className="absolute right-0 top-0  mt-16 flex flex-col p-4 border border-gray-100 rounded bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link to="/profile" className="no-underline hover:underline">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/cart" className="no-underline hover:underline">
                  <span className="md:hidden text-gray-700">Cart</span>
                  <FontAwesomeIcon icon={faCartShopping} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavigationBar;
