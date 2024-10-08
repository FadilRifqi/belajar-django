import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constant";
import LoadingComponent from "./LoadingComponent";
import AuthContext from "./AuthContext";

function OpenRoute({ children }) {
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
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthorized(false);
      }
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
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

    const tokenExpiration = decoded.exp * 1000;
    const now = Date.now();

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
    <AuthContext.Provider value={decodedToken}>{children}</AuthContext.Provider>
  );
}

export default OpenRoute;
