"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Handle mounting safely
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
    );
  }

  const handleThemeChange = () => {
    if (isChanging) return; // Prevent multiple rapid clicks
    
    setIsChanging(true);
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    
    // Use a promise to handle the theme change
    Promise.resolve(setTheme(newTheme))
      .catch(e => console.error('Theme change error:', e))
      .finally(() => {
        setTimeout(() => {
          setIsChanging(false);
        }, 300); // Add a small delay before allowing another change
      });
  };

  const displayTheme = resolvedTheme || theme;

  return (
    <button
      onClick={handleThemeChange}
      aria-label={`Switch to ${displayTheme === 'light' ? 'dark' : 'light'} mode`}
      disabled={isChanging}
      className="w-4 h-4 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
    >
      {displayTheme === "light" ? (
        <LuMoon className="w-4 h-4" />
      ) : (
        <LuSun className="w-4 h-4" />
      )}
    </button>
  );
}
