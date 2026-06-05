"use client";
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

const ThemeContext = createContext(null);
const listeners = new Set();
let currentTheme = "light";
let hasInitializedTheme = false;

const getPreferredTheme = () => {
  const savedTheme = window.localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme) => {
  currentTheme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("theme", theme);
};

const emitThemeChange = () => {
  listeners.forEach((listener) => listener());
};

const initializeTheme = () => {
  if (hasInitializedTheme) {
    return;
  }

  hasInitializedTheme = true;
  applyTheme(getPreferredTheme());
  emitThemeChange();
};

const subscribeToTheme = (listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getThemeSnapshot = () => currentTheme;

const getServerThemeSnapshot = () => "light";

export const ToggleWrapper = ({ children }) => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    initializeTheme();
  }, []);

  const toggleTheme = () => {
    applyTheme(currentTheme === "light" ? "dark" : "light");
    emitThemeChange();
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export const ThemeToggle = ({ className = "" }) => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemeToggle must be used inside ToggleWrapper.");
  }

  return (
    <button
      type="button"
      onClick={context.toggleTheme}
      className={className}
      aria-label={`Switch to ${context.theme === "dark" ? "light" : "dark"} theme`}
    >
      {context.theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
};
