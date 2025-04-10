import { use } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../services/Auth";

const CheckAuthWrapper = () => {
  const isAuthenticated = use(AuthContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default CheckAuthWrapper;
