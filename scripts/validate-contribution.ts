import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { listingJsonSchema } from "../lib/schema/listing";

const CONTRIBUTIONS_DIR = path.join(__dirname, "..", "contributions");

function main() {
  const files = readdirSync(CONTRIBUTIONS_DIR).filter(
    (f) => f.endsWith(".json") && f !== "example.json",
  );

  if (files.length === 0) {
    console.log("No contribution JSON files found in /contributions.");
    return;
  }

  let hasError = false;

  for (const file of files) {
    const fullPath = path.join(CONTRIBUTIONS_DIR, file);
    const raw = readFileSync(fullPath, "utf-8");

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      console.error(`✗ ${file}: not valid JSON`);
      hasError = true;
      continue;
    }

    const result = listingJsonSchema.safeParse(json);
    if (!result.success) {
      hasError = true;
      console.error(`✗ ${file}:`);
      for (const issue of result.error.issues) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      console.log(`✓ ${file}`);
    }
  }

  if (hasError) {
    process.exit(1);
  }
}

main();
