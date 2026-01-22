import { Navigate } from "react-router-dom";
import { isLoggedIn, getRole } from "../utlis/auth";

const HomeGuard = ({ children }) => {
  if (!isLoggedIn()) return children;

  const role = getRole();

  if (role === "owner") {
    return <Navigate to="/owner/dashboard" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children; // user
};

export default HomeGuard;
