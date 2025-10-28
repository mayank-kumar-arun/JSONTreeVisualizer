import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    onSearch(input.trim());
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search by path e.g. $.user.name"
        className="flex-1 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg p-2"
      />
      <button
        onClick={handleSearch}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Search
      </button>
    </div>
  );
}
