import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("erp_theme") !== "light";
    } catch {
      return true;
    }
  });

  const toggle = () =>
    setIsDark((d) => {
      const next = !d;
      try {
        localStorage.setItem("erp_theme", next ? "dark" : "light");
      } catch {}
      return next;
    });

  // CSS variables injected globally
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty("--bg-base", "#0f1117");
      root.style.setProperty("--bg-surface", "#13162a");
      root.style.setProperty("--bg-card", "rgba(255,255,255,0.03)");
      root.style.setProperty("--bg-sidebar", "#0d0f1c");
      root.style.setProperty("--border", "rgba(255,255,255,0.07)");
      root.style.setProperty("--border-hover", "rgba(255,255,255,0.15)");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-sub", "#94a3b8");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--text-faint", "#334155");
      root.style.setProperty("--topbar-bg", "rgba(15,17,23,0.92)");
      root.style.setProperty("--input-bg", "rgba(255,255,255,0.05)");
      root.style.setProperty("--modal-bg", "#1a1d2e");
      root.style.setProperty("--row-hover", "rgba(255,255,255,0.04)");
    } else {
      root.style.setProperty("--bg-base", "#f1f5f9");
      root.style.setProperty("--bg-surface", "#ffffff");
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--bg-sidebar", "#1e1b4b");
      root.style.setProperty("--border", "rgba(0,0,0,0.08)");
      root.style.setProperty("--border-hover", "rgba(0,0,0,0.18)");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-sub", "#475569");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--text-faint", "#94a3b8");
      root.style.setProperty("--topbar-bg", "rgba(255,255,255,0.95)");
      root.style.setProperty("--input-bg", "rgba(0,0,0,0.04)");
      root.style.setProperty("--modal-bg", "#ffffff");
      root.style.setProperty("--row-hover", "rgba(0,0,0,0.03)");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Convenience: theme-aware style helpers
export const t = {
  bg: () => "var(--bg-base)",
  surface: () => "var(--bg-surface)",
  card: () => "var(--bg-card)",
  sidebar: () => "var(--bg-sidebar)",
  border: () => "var(--border)",
  text: () => "var(--text-primary)",
  sub: () => "var(--text-sub)",
  muted: () => "var(--text-muted)",
  faint: () => "var(--text-faint)",
  topbar: () => "var(--topbar-bg)",
  inputBg: () => "var(--input-bg)",
  modalBg: () => "var(--modal-bg)",
  rowHover: () => "var(--row-hover)",
};
