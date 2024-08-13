import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constant";
import LoadingComponent from "./LoadingComponent";
import AuthContext from "./AuthContext";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = React.useState(null);
  const [decodedToken, setDecodedToken] = React.useState(null); // State to hold decoded token

  React.useEffect(() => {
    auth().catch((error) => {
      setIsAuthorized(false);
    });
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    setDecodedToken(decoded); // Set the decoded token

    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    console.log(tokenExpiration, now);

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <LoadingComponent />;
  }

  return (
    <AuthContext.Provider value={decodedToken}>
      {isAuthorized ? children : <Navigate to="/login" />}
    </AuthContext.Provider>
  );
}

export default ProtectedRoute;
