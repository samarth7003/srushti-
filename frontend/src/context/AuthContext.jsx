import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("srushti_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return !!localStorage.getItem("srushti_is_admin");
  });

  const [authLoading, setAuthLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("srushti_auth_token");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const profile = await getMe();
        setUser(profile);
        const adminFlag = profile.role === "admin";
        setIsAdmin(adminFlag);
        localStorage.setItem("srushti_auth_user", JSON.stringify(profile));
        if (adminFlag) {
          localStorage.setItem("srushti_is_admin", "true");
        } else {
          localStorage.removeItem("srushti_is_admin");
        }
      } catch (err) {
        console.error("Session restoration failed, logging out:", err.message);
        logout();
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const result = await loginUser({ email, password });
      const { user: loggedUser, token } = result;

      setUser(loggedUser);
      const adminFlag = loggedUser.role === "admin";
      setIsAdmin(adminFlag);

      localStorage.setItem("srushti_auth_token", token);
      localStorage.setItem("srushti_auth_user", JSON.stringify(loggedUser));
      if (adminFlag) {
        localStorage.setItem("srushti_is_admin", "true");
      } else {
        localStorage.removeItem("srushti_is_admin");
      }

      return loggedUser;
    } catch (err) {
      throw new Error(err.message || "Invalid credentials.");
    }
  };

  // Signup/Register
  const signup = async (email, password, name) => {
    try {
      const result = await registerUser({ name, email, password });
      const { user: newUser, token } = result;

      setUser(newUser);
      setIsAdmin(false);

      localStorage.setItem("srushti_auth_token", token);
      localStorage.setItem("srushti_auth_user", JSON.stringify(newUser));
      localStorage.removeItem("srushti_is_admin");

      return newUser;
    } catch (err) {
      throw new Error(err.message || "Registration failed.");
    }
  };

  // Logout
  const logout = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("srushti_auth_token");
    localStorage.removeItem("srushti_auth_user");
    localStorage.removeItem("srushti_is_admin");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, authLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
