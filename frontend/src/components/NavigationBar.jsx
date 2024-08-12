import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faGear } from "@fortawesome/free-solid-svg-icons";

function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <header className="w-full flex justify-center">
      <nav
        className={`z-10 flex justify-between transition-all items-center p-4 px-8 fixed top-0 ${
          scrolled ? "bg-white shadow-md w-[96%] mt-4 rounded-md" : "w-full"
        }`}
      >
        <div className="text-gray-700 text-lg font-light">
          <Link
            to="/"
            className={`hover:underline ${
              isActiveRoute("/") ? "underline" : "no-underline "
            }`}
          >
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
            className={`text-gray-700 text-lg font-light justify-between  ${
              menuOpen ? "block" : "hidden"
            } w-full md:flex md:w-auto`}
          >
            <ul className="md:shadow-none absolute shadow-md right-0 top-0  mt-16 flex flex-col p-4 border border-gray-100 rounded bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to="/settings"
                  className={`${
                    isActiveRoute("/settings") ? "underline" : "no-underline"
                  } hover:underline flex items-center gap-2`}
                >
                  <FontAwesomeIcon icon={faGear} className="md:mt-1.5" />
                  <span className="text-gray-700 md:hidden">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/carts"
                  className={`${
                    isActiveRoute("/carts") ? "underline" : "no-underline"
                  } hover:underline flex items-center gap-2`}
                >
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    className="md:mt-1.5"
                  />
                  <span className="text-gray-700 md:hidden">Cart</span>
                </Link>
              </li>
              <hr className="my-2 md:hidden" />
              <li>
                <Link
                  to="/settings/profile"
                  className={`${
                    isActiveRoute("/settings/profile")
                      ? "underline"
                      : "no-underline"
                  } hover:underline flex items-center gap-2`}
                >
                  <img
                    src="https://picsum.photos/200"
                    alt="Profile"
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-gray-700 md:hidden">Profile</span>
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
