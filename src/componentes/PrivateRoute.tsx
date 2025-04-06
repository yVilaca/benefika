import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const [valido, setValido] = useState(false);

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    await axios("http://127.0.0.1:8000/api/validate/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setValido(true);
    });
  };

  return(
    validateToken(),
    valido ? children : <Navigate to="/p" />
  );
};

export default PrivateRoute;
