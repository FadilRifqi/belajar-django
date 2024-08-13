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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <header className="w-full flex justify-center">
      <nav
        className={`z-20 flex justify-between transition-all items-center py-2 px-8 fixed top-0 ${
          scrolled ? "bg-white shadow-md w-[96%] mt-4 rounded-md" : "w-full"
        }`}
      >
        <div className="text-gray-700 text-lg font-light flex gap-4">
          <Link
            to="/"
            className={`hover:underline ${
              isActiveRoute("/") ? "underline" : "no-underline"
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
        <div className="flex gap-2 items-center">
          <Link
            to={token ? "/logout" : "/login"}
            className={`${
              isActiveRoute(token ? "/logout" : "/login")
                ? "underline"
                : "no-underline"
            } text-red-500 hidden md:flex hover:underline items-center gap-2 p-2`}
          >
            <FontAwesomeIcon
              icon={token ? faSignOutAlt : faSignInAlt}
              className="mt-0.5"
            />
            <span className="text-red-500">{token ? "Logout" : "Login"}</span>
          </Link>
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleProfileMenu}
          >
            <img
              src={
                decodedToken && decodedToken.profile_picture
                  ? decodedToken.profile_picture
                  : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg"
              }
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            {profileMenuOpen && (
              <ul className="absolute right-4 top-12 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                <li>
                  <Link
                    to="/dashboard"
                    className={`${
                      isActiveRoute("/dashboard") ? "underline" : "no-underline"
                    } hover:underline flex items-center gap-2 p-2`}
                  >
                    <FontAwesomeIcon icon={faStore} />
                    <span className="text-gray-700">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/carts"
                    className={`${
                      isActiveRoute("/carts") ? "underline" : "no-underline"
                    } hover:underline flex items-center gap-2 p-2`}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span className="text-gray-700">Cart</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className={`${
                      isActiveRoute("/settings") ? "underline" : "no-underline"
                    } hover:underline flex items-center gap-2 p-2`}
                  >
                    <FontAwesomeIcon icon={faGear} />
                    <span className="text-gray-700">Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={token ? "/logout" : "/login"}
                    className={`${
                      isActiveRoute(token ? "/logout" : "/login")
                        ? "underline"
                        : "no-underline"
                    } text-red-500 md:hidden flex hover:underline items-center gap-2 p-2`}
                  >
                    <FontAwesomeIcon
                      icon={token ? faSignOutAlt : faSignInAlt}
                    />
                    <span className="text-red-500">
                      {token ? "Logout" : "Login"}
                    </span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavigationBar;
