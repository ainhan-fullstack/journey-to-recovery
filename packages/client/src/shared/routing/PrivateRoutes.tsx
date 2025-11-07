import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../utilities/auth";
import { NavBar } from "../components/NavBar";

const PrivateRoutes = () => {
  const isLogined = isTokenValid();

  if (!isLogined) {
    return <Navigate to="/login" />;
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
