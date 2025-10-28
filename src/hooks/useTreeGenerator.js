import { useMemo } from "react";
import { generateGraphFromJson, layoutTree } from "../utils/jsonUtils";

export default function useTreeGenerator(parsedJson) {
  return useMemo(() => {
    if (!parsedJson) return { nodes: [], edges: [] };

    const { nodes, edges } = generateGraphFromJson(parsedJson);
    const positionedNodes = layoutTree(nodes, edges, { hGap: 180, vGap: 110 });

    return { nodes: positionedNodes, edges };
  }, [parsedJson]);
}
