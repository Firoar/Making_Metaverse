import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/Protected/",
          {
            withCredentials: true,
          }
        );

        if (response.data.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        alert("Please Sign In");
        console.log("Error checking auth : ", error);
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <div>Loading ...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
