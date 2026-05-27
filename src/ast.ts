export type Cardinality = { min: number | "n"; max: number | "n" };

export interface AttributeNode {
  name: string;
  key?: boolean;
  partialKey?: boolean;
  derived?: boolean;
  multivalued?: boolean;
  composite?: string[];
}

export interface EntityNode {
  kind: "entity";
  name: string;
  weak: boolean;
  attrs: AttributeNode[];
  layout?: { x?: number; y?: number };
}

export interface RelationshipEnd {
  target: string;
  card?: Cardinality;
  role?: string;
  totalParticipation?: boolean;
}

export interface RelationshipNode {
  kind: "relationship";
  name: string;
  identifying: boolean;
  ends: RelationshipEnd[];
  attrs: AttributeNode[];
}

export interface IsaNode {
  kind: "isa";
  supertype: string;
  disjoint: boolean;
  total: boolean;
  subtypes: string[];
}

export interface CategoryNode {
  kind: "category";
  name: string;
  parents: string[];
  child: string;
}

export type Statement = EntityNode | RelationshipNode | IsaNode | CategoryNode;

export interface DiagramAst {
  statements: Statement[];
  theme?: string;
}
