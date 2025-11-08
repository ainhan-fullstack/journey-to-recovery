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
      <div id="main">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoutes;
