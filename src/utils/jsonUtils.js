let idCounter = 0;

function nextId() {
  return `node-${idCounter++}`;
}

export function generateGraphFromJson(json) {
  idCounter = 0;
  const nodes = [];
  const edges = [];

  function createNode(label, type = "primitive") {
    const id = nextId();
    nodes.push({
      id,
      data: { label, type },
      position: { x: 0, y: 0 },
      style: nodeStyle(type),
    });
    return id;
  }

  function nodeStyle(type) {
    if (type === "object") {
      return {
        background: "#7c3aed",
        color: "#fff",
        padding: 8,
        borderRadius: 8,
        minWidth: 80,
      };
    }
    if (type === "array") {
      return {
        background: "#10b981",
        color: "#fff",
        padding: 8,
        borderRadius: 8,
        minWidth: 80,
      };
    }
    return {
      background: "#f97316",
      color: "#fff",
      padding: 8,
      borderRadius: 8,
      minWidth: 60,
    };
  }

  function attachChildren(value, parentId) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      for (const key of Object.keys(value)) {
        const childKeyId = createNode(key, "object");
        edges.push({
          id: `e-${parentId}-${childKeyId}`,
          source: parentId,
          target: childKeyId,
        });
        attachValue(value[key], childKeyId);
      }
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && typeof item === "object") {
          const anonObjId = createNode("(object)", "object");
          edges.push({
            id: `e-${parentId}-${anonObjId}`,
            source: parentId,
            target: anonObjId,
          });
          attachChildren(item, anonObjId);
        } else {
          const valId = createNode(String(item), "primitive");
          edges.push({
            id: `e-${parentId}-${valId}`,
            source: parentId,
            target: valId,
          });
        }
      }
      return;
    }

    const valId = createNode(String(value), "primitive");
    edges.push({
      id: `e-${parentId}-${valId}`,
      source: parentId,
      target: valId,
    });
  }

  function attachValue(value, keyNodeId) {
    if (value !== null && typeof value === "object") {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== null && typeof item === "object") {
            const anonObjId = createNode("(object)", "object");
            edges.push({
              id: `e-${keyNodeId}-${anonObjId}`,
              source: keyNodeId,
              target: anonObjId,
            });
            attachChildren(item, anonObjId);
          } else {
            const valId = createNode(String(item), "primitive");
            edges.push({
              id: `e-${keyNodeId}-${valId}`,
              source: keyNodeId,
              target: valId,
            });
          }
        }
      } else {
        attachChildren(value, keyNodeId);
      }
    } else {
      const valId = createNode(String(value), "primitive");
      edges.push({
        id: `e-${keyNodeId}-${valId}`,
        source: keyNodeId,
        target: valId,
      });
    }
  }

  if (
    json !== null &&
    typeof json === "object" &&
    !Array.isArray(json) &&
    Object.keys(json).length === 1
  ) {
    const topKey = Object.keys(json)[0];
    const topId = createNode(topKey, "object");
    attachValue(json[topKey], topId);
  } else if (
    json !== null &&
    typeof json === "object" &&
    !Array.isArray(json)
  ) {
    for (const key of Object.keys(json)) {
      const topId = createNode(key, "object");
      attachValue(json[key], topId);
    }
  } else {
    const rootId = createNode(
      "(root)",
      Array.isArray(json) ? "array" : "primitive"
    );
    if (Array.isArray(json)) {
      for (const item of json) {
        if (item !== null && typeof item === "object") {
          const anonObjId = createNode("(object)", "object");
          edges.push({
            id: `e-${rootId}-${anonObjId}`,
            source: rootId,
            target: anonObjId,
          });
          attachChildren(item, anonObjId);
        } else {
          const valId = createNode(String(item), "primitive");
          edges.push({
            id: `e-${rootId}-${valId}`,
            source: rootId,
            target: valId,
          });
        }
      }
    } else {
      const valId = createNode(String(json), "primitive");
      edges.push({ id: `e-${rootId}-${valId}`, source: rootId, target: valId });
    }
  }

  return { nodes, edges };
}


export function layoutTree(nodes, edges, opts = {}) {
  const nodeMap = new Map(nodes.map((n) => [n.id, { ...n }]));
  const children = new Map();
  const parents = new Map();

  for (const e of edges) {
    if (!children.has(e.source)) children.set(e.source, []);
    children.get(e.source).push(e.target);
    parents.set(e.target, e.source);
  }

  const roots = [];
  for (const n of nodes) if (!parents.has(n.id)) roots.push(n.id);

  const H_GAP = opts.hGap ?? 160;
  const V_GAP = opts.vGap ?? 100;

  function computeWidth(id) {
    const ch = children.get(id) || [];
    if (ch.length === 0) {
      return 1;
    }
    let w = 0;
    for (const c of ch) w += computeWidth(c);
    return w || 1;
  }

  const widthMap = new Map();
  for (const r of roots) widthMap.set(r, computeWidth(r));

  let cursor = 0;
  function place(id, depth) {
    const ch = children.get(id) || [];
    if (ch.length === 0) {
      const x = cursor * H_GAP;
      const y = depth * V_GAP;
      const node = nodeMap.get(id);
      node.position = { x, y };
      cursor += 1;
      return { minX: x, maxX: x };
    } else {
      const childRanges = [];
      for (const c of ch) {
        childRanges.push(place(c, depth + 1));
      }
      const minX = childRanges[0].minX;
      const maxX = childRanges[childRanges.length - 1].maxX;
      const centerX = (minX + maxX) / 2;
      const node = nodeMap.get(id);
      node.position = { x: centerX, y: depth * V_GAP };
      return { minX, maxX };
    }
  }

  for (const r of roots) {
    place(r, 0);
  }

  return Array.from(nodeMap.values());
}
