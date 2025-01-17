import { useEffect } from "react";
import { useAuth } from "../Store/UseContext";
import { Navigate } from "react-router-dom";


 const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" />;
};
export default Logout;