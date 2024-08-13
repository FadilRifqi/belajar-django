import PropTypes from "prop-types";
import NavigationBar from "../../components/NavigationBar";

function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <NavigationBar />
      <div className="min-h-screen pt-10 md:px-1">
        <main className="p-">{children}</main>
      </div>
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
