# Design Notes

Layers:
1. Parsing (tokenization + block parser)
2. Semantic model validation
3. Layout solver (pluggable)
4. Rendering adapters (SVG now, PNG/Canvas next)
5. Tooling (CLI, VSCode, web component)

Theme support is designed as CSS token overrides at render time.
Layout hints are planned via `@layout(x=...,y=...)` annotations on blocks.
