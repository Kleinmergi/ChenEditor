import { DiagramAst } from "./ast.js";

export function validate(ast: DiagramAst): string[] {
  const errors: string[] = [];
  const entities = new Set(ast.statements.filter((s) => s.kind === "entity").map((e: any) => e.name));
  for (const st of ast.statements) {
    if (st.kind === "relationship") {
      if (st.ends.length < 2) errors.push(`Relationship ${st.name} must have at least 2 ends.`);
      for (const e of st.ends) if (!entities.has(e.target)) errors.push(`Relationship ${st.name} references unknown entity ${e.target}.`);
    }
    if (st.kind === "isa") {
      if (!entities.has(st.supertype)) errors.push(`ISA supertype ${st.supertype} is not an entity.`);
      for (const sub of st.subtypes) if (!entities.has(sub)) errors.push(`ISA subtype ${sub} is not an entity.`);
    }
  }
  return errors;
}
