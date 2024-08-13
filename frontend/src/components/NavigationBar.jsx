import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faGear,
  faSearch,
  faSignInAlt,
  faSignOutAlt,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { REFRESH_TOKEN } from "../constant";
import AuthContext from "./AuthContext";

function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem(REFRESH_TOKEN);
  const decodedToken = useContext(AuthContext);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <header className="w-full flex justify-center">
      <nav
        className={`z-20 flex justify-between transition-all items-center p-4 px-8 fixed top-0 ${
          scrolled ? "bg-white shadow-md w-[96%] mt-4 rounded-md" : "w-full"
        }`}
      >
        <div className="text-gray-700 text-lg font-light flex gap-4">
          <Link
            to="/"
            className={`hover:underline ${
              isActiveRoute("/") ? "underline" : "no-underline "
            }`}
          >
            BUYEE
          </Link>
          <div className="cursor-pointer" onClick={toggleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          {isSearchVisible && (
            <input
              type="text"
              placeholder="Search for products"
              className="p-1 z-10 mt-8 md:mt-0 w-[calc(100%-1rem)] md:w-auto border rounded absolute md:relative left-2 right-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setIsSearchVisible(false)}
              ref={searchInputRef}
            />
          )}
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
            <ul className="md:shadow-none absolute shadow-md right-0 top-0 mt-16 flex flex-col p-4 border border-gray-100 rounded bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
              <li>
                <Link
                  to={token ? "/logout" : "/login"}
                  className={`${
                    isActiveRoute(token ? "/logout" : "/login")
                      ? "underline"
                      : "no-underline"
                  } hover:underline flex items-center gap-2`}
                >
                  <FontAwesomeIcon
                    icon={token ? faSignOutAlt : faSignInAlt}
                    className="md:mt-1"
                  />
                  <span className="text-gray-700">
                    {token ? "Logout" : "Login"}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`${
                    isActiveRoute("/settings") ? "underline" : "no-underline"
                  } hover:underline flex items-center gap-2`}
                >
                  <FontAwesomeIcon icon={faGear} className="md:mt-1" />
                  <span className="text-gray-700">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/carts"
                  className={`${
                    isActiveRoute("/carts") ? "underline" : "no-underline"
                  } hover:underline flex items-center gap-2`}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="md:mt-1" />
                  <span className="text-gray-700">Cart</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className={`${
                    isActiveRoute("/dashboard") ? "underline" : "no-underline"
                  } hover:underline flex items-center gap-2`}
                >
                  <FontAwesomeIcon icon={faStore} />
                  <span className="text-gray-700">Dashboard</span>
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
                    src={
                      decodedToken && decodedToken.profile_picture
                        ? decodedToken.profile_picture
                        : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg"
                    }
                    alt="Profile"
                    className="w-7 h-7 rounded-full"
                  />
                  {decodedToken ? (
                    <span className="text-gray-700 md:hidden">
                      {decodedToken.username}
                    </span>
                  ) : (
                    <span className="text-gray-700 md:hidden">Profile</span>
                  )}
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
