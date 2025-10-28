import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors">
        <ThemeToggle />
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;
