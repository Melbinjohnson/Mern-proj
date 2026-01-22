import { Navigate } from "react-router-dom";
import { isLoggedIn, isOwner } from "../utlis/auth.js";


const OwnerRoutes = ({ children }) => {
  if (!isLoggedIn()) return <Navigate to="/login" />;
  if (!isOwner()) return <Navigate to="/" />;
  return children;
};

export default OwnerRoutes;
