"use client";

import setGlobalColorTheme from "@/lib/theme-colors";
import { useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the ThemeColors type if not already defined elsewhere
export type ThemeColors =
  | "Zinc"
  | "Rose"
  | "Blue"
  | "Green"
  | "Orange"
  | "Purple";

// Define the type for the context
interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: (color: ThemeColors) => void;
}

// Create the context
const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams,
);

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
  // Function to get the saved theme color from localStorage
  const getSavedThemeColor = () => {
    try {
      return (localStorage.getItem("themeColor") as ThemeColors) || "Zinc";
    } catch (error) {
      return "Zinc" as ThemeColors;
    }
  };

  // State for theme color and mount status
  const [themeColor, setThemeColor] = useState<ThemeColors>(
    getSavedThemeColor(),
  );
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  // Effect to sync theme color and global theme
  useEffect(() => {
    if (theme) {
      localStorage.setItem("themeColor", themeColor);
      setGlobalColorTheme(theme as "light" | "dark", themeColor);
    }

    // Only set isMounted to true after the first render
    setIsMounted(true);
  }, [theme, themeColor]); // Include themeColor and theme as dependencies

  // If not mounted, prevent rendering
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeDataProvider");
  }
  return context;
}
