import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

const Layout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default Layout;
