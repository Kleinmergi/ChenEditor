import { DiagramAst } from "./ast.js";

export interface PositionedNode { id: string; x: number; y: number; type: string }

export function layout(ast: DiagramAst): PositionedNode[] {
  const nodes: PositionedNode[] = [];
  let x = 100, y = 100;
  for (const st of ast.statements) {
    if (st.kind === "entity") { nodes.push({ id: st.name, x, y, type: st.weak ? "weakEntity" : "entity" }); x += 220; if (x > 1000) { x = 100; y += 220; } }
    if (st.kind === "relationship") { nodes.push({ id: st.name, x: x - 110, y: y + 100, type: st.identifying ? "idRelationship" : "relationship" }); }
    if (st.kind === "isa") { nodes.push({ id: `ISA:${st.supertype}`, x: x - 110, y: y + 70, type: "isa" }); }
  }
  return nodes;
}
