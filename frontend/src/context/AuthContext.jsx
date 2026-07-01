import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("srushti_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return !!localStorage.getItem("srushti_is_admin");
  });

  // Retrieve registered users from localStorage
  const getRegisteredUsers = () => {
    const users = localStorage.getItem("srushti_registered_users");
    return users ? JSON.parse(users) : [];
  };

  // Guard login credentials for local testing
  const login = async (email, password) => {
    // Check if Firebase auth is configured
    // if (isFirebaseConfigured()) { ... await signInWithEmailAndPassword(auth, email, password) }

    // Fallback: Admin Credentials
    if (email === "admin@srushti.com" && password === "admin") {
      const adminUser = { email, name: "Srushti Admin", role: "admin" };
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem("srushti_auth_user", JSON.stringify(adminUser));
      localStorage.setItem("srushti_is_admin", "true");
      return adminUser;
    }

    // Fallback: Registered Customers
    const users = getRegisteredUsers();
    const customer = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (customer) {
      const loggedUser = { email: customer.email, name: customer.name, role: "customer" };
      setUser(loggedUser);
      setIsAdmin(false);
      localStorage.setItem("srushti_auth_user", JSON.stringify(loggedUser));
      localStorage.removeItem("srushti_is_admin");
      return loggedUser;
    }

    throw new Error("Invalid credentials. Please register or check details.");
  };

  const signup = async (email, password, name) => {
    // Check if Firebase auth is configured
    // if (isFirebaseConfigured()) { ... await createUserWithEmailAndPassword(auth, email, password) }

    const users = getRegisteredUsers();
    const alreadyExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (alreadyExists) {
      throw new Error("An account with this email already exists.");
    }

    if (email.toLowerCase() === "admin@srushti.com") {
      throw new Error("This email is reserved for administrators.");
    }

    const newUser = { email, password, name, role: "customer" };
    users.push(newUser);
    localStorage.setItem("srushti_registered_users", JSON.stringify(users));

    // Log the user in immediately
    const loggedUser = { email: newUser.email, name: newUser.name, role: "customer" };
    setUser(loggedUser);
    setIsAdmin(false);
    localStorage.setItem("srushti_auth_user", JSON.stringify(loggedUser));
    localStorage.removeItem("srushti_is_admin");
    return loggedUser;
  };

  const logout = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("srushti_auth_user");
    localStorage.removeItem("srushti_is_admin");
  };


  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
