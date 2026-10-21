import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Inspect the emitted graph, not source class names: even document-level resets
// must never become a shared CSS dependency between these independent entries.
const output = resolve("dist");
const manifest = JSON.parse(
  readFileSync(resolve(output, ".vite/manifest.json"), "utf8"),
);
const entries = Object.entries(manifest).filter(
  ([, entry]) => entry.isEntry && entry.src?.endsWith(".html"),
);
assert(
  entries.some(([key]) => key === "index.html"),
  "Missing catalog document",
);
assert(entries.length > 1, "Expected catalog and at least one landing page");

function cssDependencies(key, visited = new Set()) {
  if (visited.has(key)) return new Set();
  visited.add(key);
  const chunk = manifest[key];
  assert(chunk, `Missing chunk: ${key}`);
  const css = new Set(chunk.css ?? []);
  for (const dependency of [
    ...(chunk.imports ?? []),
    ...(chunk.dynamicImports ?? []),
  ]) {
    for (const file of cssDependencies(dependency, visited)) css.add(file);
  }
  return css;
}

const owners = new Map();
for (const [key, entry] of entries) {
  assert(existsSync(resolve(output, entry.src)), `Missing HTML: ${entry.src}`);
  const styles = cssDependencies(key);
  assert(styles.size > 0, `No stylesheet for ${entry.src}`);
  for (const stylesheet of styles) {
    assert(
      existsSync(resolve(output, stylesheet)),
      `Missing CSS: ${stylesheet}`,
    );
    assert(
      !owners.has(stylesheet),
      `CSS isolation violated: ${stylesheet} is loaded by ${owners.get(stylesheet)} and ${entry.src}`,
    );
    owners.set(stylesheet, entry.src);
  }
  console.log(
    `Verified ${entry.src}: ${styles.size} independent stylesheet(s)`,
  );
}
