import test from "node:test";
import assert from "node:assert/strict";
import { parseDsl } from "../src/parser.js";
import { validate } from "../src/semantic.js";

const sample = `
entity Artist {
  key name
  bio
}
weak entity Song {
  partialkey title
}
relationship Upload identifying {
  Artist (1,n)
  Song (1,1)
}
`;

test("parse + validate", () => {
  const ast = parseDsl(sample);
  assert.equal(ast.statements.length, 3);
  assert.deepEqual(validate(ast), []);
});
