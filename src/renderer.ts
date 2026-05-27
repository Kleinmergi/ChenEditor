import { DiagramAst } from "./ast.js";
import { layout } from "./layout.js";

export function renderSvg(ast: DiagramAst): string {
  const nodes = layout(ast);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out: string[] = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">',
    '<style>.entity{fill:#fff;stroke:#111;stroke-width:2}.weak{fill:#fff;stroke:#111;stroke-width:4}.rel{fill:#fff;stroke:#111;stroke-width:2}.idrel{fill:#fff;stroke:#111;stroke-width:4}.attr{fill:#fff;stroke:#111;stroke-width:2}.derived{stroke-dasharray:6 4}.txt{font:14px sans-serif}.key{text-decoration:underline}</style>'
  ];

  for (const st of ast.statements) {
    if (st.kind === "entity") {
      const n = byId.get(st.name)!;
      out.push(`<rect class="${st.weak ? "weak" : "entity"}" x="${n.x}" y="${n.y}" width="150" height="60"/>`);
      out.push(`<text class="txt" x="${n.x + 20}" y="${n.y + 35}">${st.name}</text>`);
      let ay = n.y - 20;
      for (const a of st.attrs) {
        out.push(`<ellipse class="attr ${a.derived ? "derived" : ""}" cx="${n.x + 75}" cy="${ay}" rx="60" ry="18"/>`);
        out.push(`<text class="txt ${a.key ? "key" : ""}" x="${n.x + 45}" y="${ay + 5}">${a.name}</text>`);
        ay -= 34;
      }
    }
    if (st.kind === "relationship") {
      const n = byId.get(st.name)!;
      const pts = `${n.x},${n.y + 30} ${n.x + 45},${n.y} ${n.x + 90},${n.y + 30} ${n.x + 45},${n.y + 60}`;
      out.push(`<polygon class="${st.identifying ? "idrel" : "rel"}" points="${pts}"/>`);
      out.push(`<text class="txt" x="${n.x + 10}" y="${n.y + 35}">${st.name}</text>`);
      for (const e of st.ends) {
        const t = byId.get(e.target);
        if (!t) continue;
        out.push(`<line x1="${n.x + 45}" y1="${n.y + 30}" x2="${t.x + 75}" y2="${t.y + 30}" stroke="#111" stroke-width="2"/>`);
      }
    }
  }

  out.push("</svg>");
  return out.join("\n");
}
