import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoutes = () => {
  const {isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }
  return (
    <>
      <NavBar />
      <div id="main" className="pt-0.5">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoutes;
