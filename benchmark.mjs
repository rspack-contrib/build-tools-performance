import { spawn } from "child_process";
import { rmSync, appendFile, readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import puppeteer from "puppeteer";
import kill from "tree-kill";

const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname;

const startConsole = "console.log('Benchmark Start Time', Date.now());";
const startConsoleRegex = /Benchmark Start Time (\d+)/;

const caseName = process.argv[2];

process.env.CASE = caseName;

class BuildTool {
  constructor(name, port, script, startedRegex, buildScript, binFilePath) {
    this.name = name;
    this.port = port;
    this.script = script;
    this.startedRegex = startedRegex;
    this.buildScript = buildScript;
    this.binFilePath = path.join(process.cwd(), "node_modules", binFilePath);

    console.log("hack bin file for", this.name, "under", this.binFilePath);
    this.hackBinFile();
  }

  cleanCache() {
    try {
      rmSync("./node_modules/.cache", { recursive: true, force: true });
      rmSync("./node_modules/.vite", { recursive: true, force: true });
      rmSync("./node_modules/.farm", { recursive: true, force: true });
    } catch (err) { }
  }

  // Add a `console.log('Benchmark start', Date.now())` to the bin file's second line
  hackBinFile() {
    const binFileContent = readFileSync(this.binFilePath, "utf-8");

    if (!binFileContent.includes(startConsole)) {
      const lines = binFileContent.split("\n");
      lines.splice(1, 0, startConsole);
      writeFileSync(this.binFilePath, lines.join("\n"));
    }
  }

  async startServer() {
    this.cleanCache();

    console.log(`Running start command: ${this.script}`);
    return new Promise((resolve, reject) => {
      const child = spawn(`node --run ${this.script}`, {
        stdio: ["pipe"],
        shell: true,
        env: {
          ...process.env,
          NO_COLOR: "1",
        },
      });
      this.child = child;
      let startTime = null;

      child.stdout.on("data", (data) => {
        const startMatch = startConsoleRegex.exec(data.toString());
        if (startMatch) {
          startTime = startMatch[1];
        }

        const match = this.startedRegex.exec(data.toString());
        if (match) {
          if (!startTime) {
            throw new Error("Start time not found");
          }
          const time = Date.now() - startTime;

          resolve(time);
        }
      });
      child.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });
      child.on("error", (error) => {
        console.log(`error: ${error.message}`);
        reject(error);
      });
      child.on("exit", (code) => {
        if (code !== 0 && code !== null) {
          console.log(
            `(${this.name} run ${this.script} failed) child process exited with code ${code}`
          );
          reject(code);
        }
      });
    });
  }

  stopServer() {
    if (this.child) {
      this.child.stdin.pause();
      this.child.stdout.destroy();
      this.child.stderr.destroy();
      kill(this.child.pid);
    }
  }

  async build() {
    this.cleanCache();

    console.log(`Running build command: ${this.buildScript}`);
    const child = spawn(`node --run ${this.buildScript}`, {
      stdio: ["pipe"],
      shell: true,
      env: {
        ...process.env,
        NO_COLOR: "1",
      },
    });
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
      child.on("exit", (code) => {
        if (code === 0) {
          resolve(Date.now() - startTime);
        } else {
          reject(new Error(`Build failed with exit code ${code}`));
        }
      });
      child.on("error", reject);
    });
  }
}

const buildTools = [
  new BuildTool(
    "Rsbuild " + require("@rsbuild/core/package.json").version,
    3000,
    "start:rsbuild",
    /in (.+) (s|ms)/,
    "build:rsbuild",
    "@rsbuild/core/bin/rsbuild.js"
  ),
  new BuildTool(
    "Rsbuild (Lazy Compilation) " +
    require("@rsbuild/core/package.json").version,
    3000,
    "start:rsbuild:lazy",
    /in (.+) (s|ms)/,
    "build:rsbuild",
    "@rsbuild/core/bin/rsbuild.js"
  ),
  new BuildTool(
    "Rspack CLI " + require("@rspack/core/package.json").version,
    8080,
    "start:rspack",
    /in (.+) (s|ms)/,
    "build:rspack",
    "@rspack/cli/bin/rspack.js"
  ),
  new BuildTool(
    "Rspack CLI (Lazy Compilation) " +
    require("@rspack/core/package.json").version,
    8080,
    "start:rspack:lazy",
    /in (.+) (s|ms)/,
    "build:rspack",
    "@rspack/cli/bin/rspack.js"
  ),
  process.env.ENABLE_FARM &&
  new BuildTool(
    "Farm " + require("@farmfe/core/package.json").version,
    9000,
    "start:farm",
    /Ready in (.+)(s|ms)/,
    "build:farm",
    "@farmfe/cli/bin/farm.mjs"
  ),
  new BuildTool(
    "Vite (SWC) " + require("vite/package.json").version,
    5173,
    "start:vite",
    /ready in (\d+) (s|ms)/,
    "build:vite",
    "vite/bin/vite.js"
  ),
  new BuildTool(
    "Webpack (SWC) " + require("webpack/package.json").version,
    8082,
    "start:webpack",
    /compiled .+ in (.+) (s|ms)/,
    "build:webpack",
    "webpack-cli/bin/cli.js"
  ),
].filter(Boolean);

const browser = await puppeteer.launch();

const n = 6;

console.log("Running benchmark " + n + " times, please wait...");

const totalResults = [];

for (let i = 0; i < n; i++) {
  await runBenchmark();
}

async function runBenchmark() {
  const results = {};

  for (const buildTool of buildTools) {
    const time = await buildTool.startServer();
    const page = await browser.newPage();
    const start = Date.now();

    page.on("load", () => {
      const loadTime = Date.now() - start;
      console.log(
        buildTool.name,
        "startup time: " + (time + loadTime) + "ms"
      );

      if (!results[buildTool.name]) {
        results[buildTool.name] = {};
      }

      results[buildTool.name].startup = time + loadTime;
      results[buildTool.name].serverStart = time;
      results[buildTool.name].onLoad = loadTime;
    });

    console.log("Navigating to", `http://localhost:${buildTool.port}`);

    await page.goto(`http://localhost:${buildTool.port}`, {
      timeout: 60000,
    });

    let waitResolve = null;
    const waitPromise = new Promise((resolve) => {
      waitResolve = resolve;
    });

    let hmrRootStart = -1;
    let hmrLeafStart = -1;

    page.on("console", (event) => {
      const isFinished = () => {
        return (
          results[buildTool.name]?.rootHmr && results[buildTool.name]?.leafHmr
        );
      };
      if (event.text().includes("root hmr")) {
        const clientDateNow = /(\d+)/.exec(event.text())[1];
        const hmrTime = clientDateNow - hmrRootStart;
        console.log(buildTool.name, " Root HMR time: " + hmrTime + "ms");

        results[buildTool.name].rootHmr = hmrTime;
        if (isFinished()) {
          page.close();
          waitResolve();
        }
      } else if (event.text().includes("leaf hmr")) {
        const hmrTime = Date.now() - hmrLeafStart;
        console.log(buildTool.name, " Leaf HMR time: " + hmrTime + "ms");
        results[buildTool.name].leafHmr = hmrTime;
        if (isFinished()) {
          page.close();
          waitResolve();
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const rootFilePath = path.join(__dirname, "src", caseName, "f0.jsx");
    const originalRootFileContent = readFileSync(rootFilePath, "utf-8");

    appendFile(
      rootFilePath,
      `
    console.log('root hmr', Date.now());
    `,
      (err) => {
        if (err) throw err;
        hmrRootStart = Date.now();
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const leafFilePath = path.join(__dirname, "src", caseName, "d0/d0/d0/f0.jsx");
    const originalLeafFileContent = readFileSync(leafFilePath, "utf-8");
    appendFile(
      leafFilePath,
      `
      console.log('leaf hmr', Date.now());
      `,
      (err) => {
        if (err) throw err;
        hmrLeafStart = Date.now();
      }
    );

    await waitPromise;

    // restore files
    writeFileSync(rootFilePath, originalRootFileContent);
    writeFileSync(leafFilePath, originalLeafFileContent);

    buildTool.stopServer();

    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("close Server");
    console.log("prepare build");

    const buildTime = await buildTool.build();
    console.log(buildTool.name, ": build time: " + buildTime + "ms");
    results[buildTool.name].prodBuild = buildTime;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  totalResults.push(results);
}

// average results
const averageResults = {};

// drop the first run as warmup
totalResults.shift();

for (const result of totalResults) {
  for (const [name, values] of Object.entries(result)) {
    if (!averageResults[name]) {
      averageResults[name] = {};
    }

    for (const [key, value] of Object.entries(values)) {
      if (!averageResults[name][key]) {
        averageResults[name][key] = 0;
      }

      averageResults[name][key] += Number(value);
    }
  }
}

for (const [name, values] of Object.entries(averageResults)) {
  for (const [key, value] of Object.entries(values)) {
    averageResults[name][key] = Math.floor(value / totalResults.length) + "ms";
  }
}

console.log("average results of " + totalResults.length + " runs:");
console.table(averageResults);

process.exit(0);
