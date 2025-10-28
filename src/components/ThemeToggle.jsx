import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] p-3 rounded-full shadow-md hover:scale-110 transition-all"
      title="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
