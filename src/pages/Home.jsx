import { useState } from "react";
import JsonInput from "../components/JsonInput";
import JsonTree from "../components/JsonTree";
import SearchBar from "../components/SearchBar";
import useJsonParser from "../hooks/useJsonParser";
import useTreeGenerator from "../hooks/useTreeGenerator";

export default function Home() {
  const [jsonData, setJsonData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { isValidJson, parseJson, error } = useJsonParser();
  const { nodes, edges, highlightNode } = useTreeGenerator(
    jsonData,
    searchQuery
  );

  const handleGenerate = (inputValue) => {
    const { valid, data } = parseJson(inputValue);
    if (valid) setJsonData(data);
  };


  return (
    <div className="flex flex-col items-center p-6 gap-6">
      <h1 className="text-3xl font-bold text-blue-700">
        JSON Tree Visualizer 🌳
      </h1>
      <JsonInput
        onGenerate={handleGenerate}
        error={error}
        onClear={() => setJsonData(null)}
      />
      {jsonData && (
        <>
          <JsonTree nodes={nodes} edges={edges} highlightNode={highlightNode} />
        </>
      )}
    </div>
  );
}
