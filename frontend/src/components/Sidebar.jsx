import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <aside className="w-full lg:w-1/4 bg-gray-200 p-4 flex-grow  shadow-md mt-4 lg:mt-0 lg:ml-4 rounded-lg">
      <Link to={"/settings"}>
        <h3
          className={`text-lg font-semibold text-gray-700 mb-4 ${
            isActiveRoute("/settings") ? "underline" : "no-underline"
          }`}
        >
          Settings
        </h3>
      </Link>
      <ul>
        <li className="mb-2">
          <Link
            to={"/settings/profile"}
            className={`text-gray-700 hover:underline ${
              isActiveRoute("/settings/profile") ? "underline" : "no-underline"
            }`}
          >
            Account
          </Link>
        </li>
        <li className="mb-2">
          <Link
            to={"/settings/privacy"}
            className={`text-gray-700 hover:underline ${
              isActiveRoute("/settings/privacy") ? "underline" : "no-underline"
            }`}
          >
            Privacy
          </Link>
        </li>
        <li className="mb-2">
          <Link
            to={"/settings/notifications"}
            className={`text-gray-700 hover:underline ${
              isActiveRoute("/settings/notifications")
                ? "underline"
                : "no-underline"
            }`}
          >
            Notifications
          </Link>
        </li>
        <li>
          <Link
            to={"/settings/billing"}
            className={`text-gray-700 hover:underline ${
              isActiveRoute("/settings/billing") ? "underline" : "no-underline"
            }`}
          >
            Billing
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
