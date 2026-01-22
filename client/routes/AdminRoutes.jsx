import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utlis/auth.js";

const AdminRoutes = ({ children }) => {
  if (!isLoggedIn()) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/" />;
  return children;
};

export default AdminRoutes;
