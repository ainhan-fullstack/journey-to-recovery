import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../utilities/schema";
import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { postWithAuth } from "../utilities/auth";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postWithAuth("/signup", data);
      localStorage.setItem("accessToken", response?.data.accessToken);
      navigate("/profile-form");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Registration failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-purple-800 text-white p-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="mb-8 max-w-xs">
            Already have an account? Sign in to access your platform.
          </p>
          <NavLink to={"/login"}>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white rounded-md
                       hover:bg-white hover:text-purple-800 transition-colors cursor-pointer"
            >
              SIGN IN
            </Button>
          </NavLink>
        </div>

        <div className="p-12">
          <h2 className="text-3xl font-bold mb-8 text-purple-800">
            Create Account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="mt-1"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-600"
              >
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                className="mt-1"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-purple-800 hover:bg-purple-900 text-white rounded-md mt-4 cursor-pointer"
              disabled={loading}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
