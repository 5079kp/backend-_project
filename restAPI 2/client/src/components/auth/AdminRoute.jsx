import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  // Loading state - consider a spinner component
  if (loading) {
    return <div>Loading...</div>; // Could be a proper loading spinner
  }

  // Role-based access control
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;