import PropTypes from "prop-types";
import NavigationBar from "../../components/NavigationBar";

function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <NavigationBar />
      <div className="h-screen pt-10 ">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
