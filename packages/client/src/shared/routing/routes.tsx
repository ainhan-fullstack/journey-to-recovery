import { createBrowserRouter } from "react-router-dom";
import Signup from "../components/Signup";
import Login from "../components/Login";
import ProfileForm from "../components/ProfileForm";
import Dashboard from "../components/DashBoard";
import PrivateRoutes from "./PrivateRoutes";
import Layout from "../routing/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      {
        element: <PrivateRoutes />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "profile", element: <ProfileForm /> },
        ],
      },
    ],
  },
]);
