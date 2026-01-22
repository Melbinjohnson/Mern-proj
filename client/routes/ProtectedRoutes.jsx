import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utlis/auth.js";

const ProtectedRoutes = ({ children }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoutes;
