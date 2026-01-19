import { spawn } from "child_process";
import path from "path";

/**
 * Convenience script to run both static and dynamic seeds
 * Usage: npm run seed:all
 * Runs seed-static.ts followed by seed-dynamic.ts
 */

async function runScript(scriptPath: string, scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("tsx", [scriptPath], {
      cwd: path.dirname(scriptPath),
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} exited with code ${code}`));
      } else {
        resolve();
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function seedAll() {
  console.log("🌱 Running full seed: static + dynamic...\n");

  try {
    const staticScript = path.join(__dirname, "seed-static.ts");
    const dynamicScript = path.join(__dirname, "seed-dynamic.ts");

    console.log("Step 1: Static seed (practices, persons, animals)");
    await runScript(staticScript, "seed-static");

    console.log("\n\nStep 2: Dynamic seed (appointments)");
    await runScript(dynamicScript, "seed-dynamic");

    console.log("\n\n✅ Full seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAll();
