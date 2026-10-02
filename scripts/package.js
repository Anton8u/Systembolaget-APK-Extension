/**
 * Builds the zip to upload to the Chrome Web Store: only the files the
 * extension actually needs, never tests, node_modules or dev tooling.
 *
 *   npm run package  ->  dist/systembolaget-apk-extension-<version>.zip
 */
const fs = require("node:fs");
const path = require("node:path");
const AdmZip = require("adm-zip");

const root = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

// Whole folders that only contain extension files.
const FOLDERS = ["src", "popup"];
// Individual files: the manifest, the icons it names, and the popup's fonts.
const FILES = [
  "manifest.json",
  ...Object.values(manifest.action.default_icon),
  "images_and_font/Montserrat-Regular.ttf",
  "images_and_font/Montserrat-Bold.ttf",
];

// Everything the manifest points at must be in the package.
const referenced = [
  manifest.action.default_popup,
  ...Object.values(manifest.action.default_icon),
  ...manifest.content_scripts.flatMap((entry) => [...entry.js, ...(entry.css ?? [])]),
];

const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const isPackaged = (relativePath) =>
  FILES.includes(relativePath) || FOLDERS.some((folder) => relativePath.startsWith(`${folder}/`));

const missing = [...FILES, ...FOLDERS, ...referenced].filter((file) => !exists(file));
const unpackaged = referenced.filter((file) => !isPackaged(file));
if (missing.length > 0 || unpackaged.length > 0) {
  if (missing.length > 0) console.error("Missing files:", missing);
  if (unpackaged.length > 0) console.error("Referenced by the manifest but not packaged:", unpackaged);
  process.exit(1);
}

const zip = new AdmZip();
for (const folder of FOLDERS) zip.addLocalFolder(path.join(root, folder), folder);
for (const file of [...new Set(FILES)]) {
  zip.addLocalFile(path.join(root, file), path.posix.dirname(file) === "." ? "" : path.posix.dirname(file));
}

const outDir = path.join(root, "dist");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `systembolaget-apk-extension-${manifest.version}.zip`);
zip.writeZip(outFile);

console.log(`Wrote ${path.relative(root, outFile)}:`);
for (const entry of zip.getEntries()) console.log(`  ${entry.entryName}`);
