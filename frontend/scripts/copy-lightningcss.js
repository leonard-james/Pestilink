const fs = require("fs");
const path = require("path");

const src = path.join(
  __dirname,
  "..",
  "node_modules",
  "lightningcss",
  "node_modules",
  "lightningcss-win32-x64-msvc",
  "lightningcss.win32-x64-msvc.node"
);
const dest = path.join(
  __dirname,
  "..",
  "node_modules",
  "lightningcss",
  "lightningcss.win32-x64-msvc.node"
);

if (process.platform !== "win32") {
  process.exit(0);
}

if (!fs.existsSync(src)) {
  throw new Error(
    "The Lightning CSS Windows binary is missing. Reinstall dependencies with `npm install` in the frontend directory."
  );
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);

try {
  require("lightningcss");
} catch (error) {
  throw new Error("Lightning CSS could not load its Windows native module.", { cause: error });
}
