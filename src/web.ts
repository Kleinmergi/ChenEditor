import { parseDsl, renderSvg, validate } from "./index.js";

const exampleDsl = `# Chen DSL example
entity Artist {
  key name
  bio
}

weak entity Song {
  partialkey title
  length
}

relationship Upload identifying {
  Artist (1,n)
  Song (1,1)
}

entity User {
  key id
  name
}

weak entity Playlist {
  partialkey name
  createdAt
}

entity SongPlaylist {
  key id
}

entity ArtistPlaylist {
  key id
}

relationship Creates identifying {
  User (0,1000)
  Playlist (1,1)
}

isa Playlist disjoint total {
  SongPlaylist
  ArtistPlaylist
}

relationship ContainsSongs {
  SongPlaylist (0,500)
  Song (0,n)
}

relationship ListenFrom {
  User (0,1)
  Song (0,n)
  SongPlaylist (0,n)
}`;

const $ = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
};

const input = $<HTMLTextAreaElement>("dslInput");
const preview = $<HTMLDivElement>("previewCanvas");
const status = $<HTMLDivElement>("status");
const themeToggle = $<HTMLButtonElement>("themeToggle");
let lastSvg = "";

function setStatus(message: string, type: "ok" | "error" = "ok") {
  status.textContent = message;
  status.classList.toggle("error", type === "error");
}

function render() {
  try {
    const ast = parseDsl(input.value);
    const errors = validate(ast);
    lastSvg = renderSvg(ast);
    preview.innerHTML = lastSvg;

    if (errors.length > 0) {
      setStatus(`${errors.length} Hinweis(e): ${errors.join(" · ")}`, "error");
      return;
    }
    setStatus(`Alles gut: ${ast.statements.length} Statement(s) gerendert.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Parser-Fehler: ${message}`, "error");
  }
}

async function copyText(text: string, success: string) {
  await navigator.clipboard.writeText(text);
  setStatus(success);
}

function downloadSvg() {
  if (!lastSvg) render();
  const blob = new Blob([lastSvg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chen-diagram.svg";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("SVG wurde als chen-diagram.svg vorbereitet.");
}

function applyTheme(isDark: boolean) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("chen-editor-theme", isDark ? "dark" : "light");
}

input.value = localStorage.getItem("chen-editor-dsl") || exampleDsl;
input.addEventListener("input", () => {
  localStorage.setItem("chen-editor-dsl", input.value);
  render();
});

$("loadExample").addEventListener("click", () => {
  input.value = exampleDsl;
  localStorage.setItem("chen-editor-dsl", input.value);
  render();
});
$("clearEditor").addEventListener("click", () => {
  input.value = "";
  localStorage.removeItem("chen-editor-dsl");
  render();
  input.focus();
});
$("copyDsl").addEventListener("click", () => copyText(input.value, "DSL in die Zwischenablage kopiert."));
$("copySvg").addEventListener("click", () => copyText(lastSvg, "SVG in die Zwischenablage kopiert."));
$("downloadSvg").addEventListener("click", downloadSvg);
themeToggle.addEventListener("click", () => applyTheme(!document.body.classList.contains("dark")));

const savedTheme = localStorage.getItem("chen-editor-theme");
applyTheme(savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
render();
