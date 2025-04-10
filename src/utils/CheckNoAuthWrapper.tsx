import { use } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../services/Auth";

const CheckNoAuthWrapper = () => {
  const { isAuthenticated } = use(AuthContext);
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default CheckNoAuthWrapper;
