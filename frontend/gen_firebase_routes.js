import fsProm from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

console.info('Assumes you have already ran "next build && next export"');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRootPath = path.join(__dirname, "..", "..");

const routeManifestPath = path.join(
  projectRootPath,
  "ExTool-SE-Project",
  "frontend",
  ".next",
  "routes-manifest.json"
);

const firebaseJsonPath = path.join(
  projectRootPath,
  "ExTool-SE-Project",
  "frontend",
  "firebase.json"
);

const routeManifestTxt = await fsProm.readFile(routeManifestPath, "utf8");
const routeManifest = JSON.parse(routeManifestTxt);

const modifiedRoutes = routeManifest.dynamicRoutes.map(({ page, regex }) => {
  const destination = `${page}/index.html`;
  return {
    destination,
    regex,
  };
});

const firebaseJsonTxt = await fsProm.readFile(firebaseJsonPath, "utf8");
const firebaseJson = JSON.parse(firebaseJsonTxt);

firebaseJson.hosting.rewrites = modifiedRoutes;

const firebaseJsonModTxt = JSON.stringify(firebaseJson, null, 2);
// console.log(firebaseJsonModTxt);
await fsProm.writeFile(firebaseJsonPath, firebaseJsonModTxt, "utf8");

console.log("Done! Commit the changes if you're happy with them.");
