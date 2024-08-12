import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-full lg:w-1/4 bg-gray-200 p-4 flex-grow  shadow-md mt-4 lg:mt-0 lg:ml-4 rounded-lg">
      <Link to={"/settings"}>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Settings</h3>
      </Link>
      <ul>
        <li className="mb-2">
          <Link
            to={"/settings/profile"}
            className="text-blue-600 hover:underline"
          >
            Account
          </Link>
        </li>
        <li className="mb-2">
          <a href="#" className="text-blue-600 hover:underline">
            Privacy
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-blue-600 hover:underline">
            Notifications
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Billing
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
