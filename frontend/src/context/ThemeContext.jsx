import React, { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Always light mode — permanently remove dark class and clear storage
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("srushti_theme");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
