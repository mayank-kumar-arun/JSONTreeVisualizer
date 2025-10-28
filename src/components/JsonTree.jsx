import { useCallback, useRef } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import domtoimage from "dom-to-image-more";

export default function JsonTree({ nodes, edges }) {
  const flowRef = useRef(null);

  const handleDownload = useCallback(() => {
    if (!flowRef.current) return;

    const flowElement = flowRef.current.querySelector(".react-flow__viewport");
    if (!flowElement) return;

    domtoimage
      .toPng(flowElement, {
        cacheBust: true,
        bgcolor: "#ffffff",
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "json-tree.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Error generating image:", err);
      });
  }, []);

  return (
    <div
      ref={flowRef}
      className="w-full h-[70vh] border rounded-lg bg-white dark:bg-black shadow relative"
    >
      <button
        onClick={handleDownload}
        className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-all z-10 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Download Tree
      </button>

      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
