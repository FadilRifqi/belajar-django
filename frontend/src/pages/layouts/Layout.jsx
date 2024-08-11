import PropTypes from "prop-types";
import NavigationBar from "../../components/NavigationBar";

function Layout({ children }) {
  return (
    <div className="container">
      <NavigationBar />
      {children}
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
