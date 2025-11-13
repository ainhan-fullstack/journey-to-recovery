import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextType, User } from "../utilities/types";
import { useNavigate } from "react-router-dom";
import api from "../utilities/axiosConfig";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const fetchUser = async () => {
  //   try {
  //     const response = await api.get("/profile");
  //     setUser(response.data.userInfo);
  //   } catch (error) {
  //     localStorage.removeItem("accessToken");
  //     setUser(null);
  //     console.error("Failed to fetch user", error);
  //   }
  // };
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/profile");
      setUser(response.data.userInfo); // You had .user, but your backend sends .userInfo
    } catch (error) {
      localStorage.removeItem("accessToken");
      setUser(null);
      console.error("Failed to fetch user", error);
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      await fetchUser();
      setIsLoading(false);
    };
    checkAuthStatus();
  }, [fetchUser]);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await api.post("/login", { email, password });
        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        await fetchUser();

        navigate("/");
      } catch (err) {
        console.error("Login failed:", err);
        throw err;
      }
    },
    [navigate]
  );

  // Signup function
  const signup = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      try {
        const response = await api.post("/signup", { email, password, confirmPassword });
        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        await fetchUser();
        navigate("/profile");
      } catch (err) {
        console.error("Signup failed:", err);
        throw err;
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refetchUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
