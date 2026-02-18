import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (theme: Theme) => {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
};

const stored = (localStorage.getItem("inboxiq-theme") as Theme) || "system";
const initialResolved = applyTheme(stored);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: stored,
  resolvedTheme: initialResolved,

  setTheme: (theme) => {
    localStorage.setItem("inboxiq-theme", theme);
    const resolved = applyTheme(theme);
    set({ theme, resolvedTheme: resolved });
  },
}));

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const state = useThemeStore.getState();
  if (state.theme === "system") {
    const resolved = applyTheme("system");
    useThemeStore.setState({ resolvedTheme: resolved });
  }
});
