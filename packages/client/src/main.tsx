import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./shared/components/Signup.tsx";
import ProfileForm from "./shared/components/ProfileForm.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Signup />,},
  { path: "/profile-form", element: <ProfileForm /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
