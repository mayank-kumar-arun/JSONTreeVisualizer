import { useState } from "react";

export default function JsonInput({ onGenerate, error, onClear }) {
  const [value, setValue] = useState("");

  const handleClear = () => {
    setValue("");
    onClear();
  };

  return (
    <div className="w-full max-w-2xl">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={10}
        placeholder='{
  "user": {
    "name": "Mayank",
    "age": 25,
    "skills": ["React", "Tailwind", "Node"]
  }
}'
        className="w-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="mt-3 flex gap-3">
        <button
          onClick={() => onGenerate(value)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Generate Tree
        </button>

        <button
          onClick={handleClear}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
