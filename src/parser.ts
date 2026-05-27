import { DiagramAst, EntityNode, RelationshipNode, IsaNode, AttributeNode } from "./ast.js";

const strip = (s: string) => s.replace(/#.*/g, "").trim();

function parseCardinality(token: string) {
  const m = token.match(/^\((\d+|n)\s*,\s*(\d+|n)\)$/i);
  if (!m) return undefined;
  const toV = (v: string) => (v.toLowerCase() === "n" ? "n" : Number(v));
  return { min: toV(m[1]), max: toV(m[2]) } as const;
}

function parseAttr(line: string): AttributeNode {
  const parts = line.trim().split(/\s+/);
  if (parts[0] === "key") return { name: parts.slice(1).join(" "), key: true };
  if (parts[0] === "partialkey") return { name: parts.slice(1).join(" "), partialKey: true };
  if (parts[0] === "derived") return { name: parts.slice(1).join(" "), derived: true };
  if (parts[0] === "multivalued") return { name: parts.slice(1).join(" "), multivalued: true };
  if (parts[0] === "composite") {
    const name = parts[1];
    const subs = line.includes(":") ? line.split(":")[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
    return { name, composite: subs };
  }
  return { name: line.trim() };
}

export function parseDsl(input: string): DiagramAst {
  const lines = input.split(/\r?\n/).map(strip).filter(Boolean);
  const statements = [] as DiagramAst["statements"];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("entity ") || line.startsWith("weak entity ")) {
      const weak = line.startsWith("weak entity ");
      const name = line.replace(/^weak entity\s+|^entity\s+/, "").replace(/\s*\{\s*$/, "").trim();
      const attrs: AttributeNode[] = [];
      while (++i < lines.length && lines[i] !== "}") attrs.push(parseAttr(lines[i]));
      const entity: EntityNode = { kind: "entity", name, weak, attrs };
      statements.push(entity);
      continue;
    }
    if (line.startsWith("relationship ")) {
      const identifying = /\bidentifying\b/.test(line);
      const name = line.replace(/^relationship\s+/, "").replace(/\s+identifying/, "").replace(/\s*\{\s*$/, "").trim();
      const rel: RelationshipNode = { kind: "relationship", name, identifying, ends: [], attrs: [] };
      while (++i < lines.length && lines[i] !== "}") {
        if (/^(key|partialkey|derived|multivalued|composite)\b/.test(lines[i])) rel.attrs.push(parseAttr(lines[i]));
        else {
          const m = lines[i].match(/^(\w+)\s*(\([^)]+\))?\s*(role\s+\w+)?\s*(!)?$/i);
          if (!m) throw new Error(`Invalid relationship end: ${lines[i]}`);
          rel.ends.push({
            target: m[1],
            card: m[2] ? parseCardinality(m[2]) : undefined,
            role: m[3]?.replace(/^role\s+/, ""),
            totalParticipation: Boolean(m[4])
          });
        }
      }
      statements.push(rel);
      continue;
    }
    if (line.startsWith("isa ")) {
      const disjoint = /\bdisjoint\b/.test(line);
      const total = /\btotal\b/.test(line);
      const supertype = line.replace(/^isa\s+/, "").replace(/\b(disjoint|overlap|total|partial)\b/g, "").replace(/\{\s*$/, "").trim();
      const subtypes: string[] = [];
      while (++i < lines.length && lines[i] !== "}") subtypes.push(lines[i]);
      const isa: IsaNode = { kind: "isa", supertype, disjoint, total, subtypes };
      statements.push(isa);
      continue;
    }
  }
  return { statements };
}
