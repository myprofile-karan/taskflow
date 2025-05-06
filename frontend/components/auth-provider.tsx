"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Define route configurations
  const PUBLIC_ROUTES = ["/login", "/register"];
  const PROTECTED_ROUTES = ["/dashboard", "/tasks", "/teams"];
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Make a request to a protected endpoint that verifies the token
        const res = await axios.get("/api/auth/verify", {
          withCredentials: true 
        });
          console.log(res,"response")
        if (res.status === 200 && res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      } catch (error) {
        // Token verification failed or server error
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [pathname]); // Re-verify when route changes

  // Handle redirects based on authentication status
  useEffect(() => {
    if (loading) return; // Wait until we've checked auth status
    console.log(isAuthenticated, "isAuthenticated")
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    
    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && isProtectedRoute) {
      router.push("/login");
    } 
    // If user is authenticated and trying to access public route
    else if (isAuthenticated && isPublicRoute) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/login", 
        { email, password },
        { withCredentials: true }
      );

      const userData = res.data;
      setUser(userData.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData.user));
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error?.response?.data?.error || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/register", 
        { name, email, password },
        { withCredentials: true }
      );

      // After successful registration, redirect to login
      router.push("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error?.response?.data?.error || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Call the logout API to clear the cookie
      await axios.post("/api/logout", {}, {
        withCredentials: true
      });
      
      // Clear user from state and local storage
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};