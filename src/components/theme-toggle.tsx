"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
    );
  }

  const displayTheme = resolvedTheme || theme;

  return (
    <button
      onClick={() => setTheme(displayTheme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${displayTheme === 'light' ? 'dark' : 'light'} mode`}
      className="w-4 h-4 flex items-center justify-center cursor-pointer"
    >
      {displayTheme === "light" ? (
        <LuMoon className="w-4 h-4" />
      ) : (
        <LuSun className="w-4 h-4" />
      )}
    </button>
  );
}