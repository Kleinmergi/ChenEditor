# ChenEditor

A modern text-based DSL + renderer for **true Chen-style ER/EER diagrams**.

## DSL Grammar (v0.1)

```ebnf
diagram        := statement* ;
statement      := entity | relationship | isa ;
entity         := ("entity" | "weak entity") IDENT "{" attribute* "}" ;
attribute      := "key" IDENT
               | "partialkey" IDENT
               | "derived" IDENT
               | "multivalued" IDENT
               | "composite" IDENT (":" IDENT ("," IDENT)*)?
               | IDENT ;
relationship   := "relationship" IDENT ("identifying")? "{" relEndOrAttr* "}" ;
relEndOrAttr   := relEnd | attribute ;
relEnd         := IDENT cardinality? ("role" IDENT)? ("!")? ;
cardinality    := "(" (NUMBER|"n") "," (NUMBER|"n") ")" ;
isa            := "isa" IDENT ("disjoint"|"overlap")? ("total"|"partial")? "{" IDENT+ "}" ;
```

## Architecture

- `src/parser.ts`: parser -> AST
- `src/semantic.ts`: semantic validation
- `src/layout.ts`: auto-layout (deterministic grid baseline)
- `src/renderer.ts`: Chen SVG rendering (rectangles/diamonds/ellipses/underline)
- `src/cli.ts`: CLI renderer
- `vscode-extension/`: live preview extension scaffold

## Usage

```bash
npm install
npm run build
node dist/src/cli.js examples/music.chen --out examples/music.svg
```

## Roadmap

- PNG export
- interactive HTML canvas renderer
- categories/union types parser support
- formal constraint checking
- SQL mapping and reverse engineering
