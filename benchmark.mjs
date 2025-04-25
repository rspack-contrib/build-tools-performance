import { spawn } from 'child_process';
import { rmSync, appendFile, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import puppeteer from 'puppeteer';
import kill from 'tree-kill';
import { logger } from 'rslog';
import color from 'picocolors';

const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname;

const startConsole = "console.log('Benchmark Start Time', Date.now());";
const startConsoleRegex = /Benchmark Start Time (\d+)/;

const caseName = process.env.CASE ?? 'medium';

process.env.CASE = caseName;

class BuildTool {
  constructor({
    name,
    port,
    startScript,
    startedRegex,
    buildScript,
    binFilePath,
  }) {
    this.name = name;
    this.port = port;
    this.startScript = startScript;
    this.startedRegex = startedRegex;
    this.buildScript = buildScript;
    this.binFilePath = path.join(process.cwd(), 'node_modules', binFilePath);
    this.hackBinFile();
  }

  cleanCache() {
    try {
      rmSync('./node_modules/.cache', { recursive: true, force: true });
      rmSync('./node_modules/.vite', { recursive: true, force: true });
      rmSync('./node_modules/.farm', { recursive: true, force: true });
    } catch (err) {}
  }

  // Add a `console.log('Benchmark start', Date.now())` to the bin file's second line
  hackBinFile() {
    logger.info(
      'Setup bin file for',
      color.green(this.name),
      color.dim(`(${this.binFilePath.split('node_modules/')[1]})`),
    );

    const binFileContent = readFileSync(this.binFilePath, 'utf-8');

    if (!binFileContent.includes(startConsole)) {
      const lines = binFileContent.split('\n');
      lines.splice(1, 0, startConsole);
      writeFileSync(this.binFilePath, lines.join('\n'));
    }
  }

  async startServer() {
    this.cleanCache();

    logger.log('');
    logger.start(
      `Running start command: ${color.bold(color.yellow(this.startScript))}`,
    );
    return new Promise((resolve, reject) => {
      const child = spawn(`node --run ${this.startScript}`, {
        stdio: ['pipe'],
        shell: true,
        env: {
          ...process.env,
          NO_COLOR: '1',
        },
      });
      this.child = child;
      let startTime = null;

      child.stdout.on('data', (data) => {
        const text = data.toString();

        if (process.env.DEBUG) {
          console.log(text);
        }

        const startMatch = startConsoleRegex.exec(text);
        if (startMatch) {
          startTime = startMatch[1];
        }

        const match = this.startedRegex.exec(text);
        if (match) {
          if (!startTime) {
            throw new Error('Start time not found');
          }
          const time = Date.now() - startTime;

          resolve(time);
        }
      });

      child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      child.on('error', (error) => {
        console.log(`error: ${error.message}`);
        reject(error);
      });
      child.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          console.log(
            `(${this.name} run ${this.startScript} failed) child process exited with code ${code}`,
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

    logger.log('');
    logger.start(
      `Running build command: ${color.bold(color.yellow(this.buildScript))}`,
    );
    const child = spawn(`node --run ${this.buildScript}`, {
      stdio: ['pipe'],
      shell: true,
      env: {
        ...process.env,
        NO_COLOR: '1',
      },
    });
    const startTime = Date.now();
    return new Promise((resolve, reject) => {
      child.on('exit', (code) => {
        if (code === 0) {
          resolve(Date.now() - startTime);
        } else {
          reject(new Error(`Build failed with exit code ${code}`));
        }
      });
      child.on('error', reject);
    });
  }
}

const parseToolNames = () => {
  const allTools = ['rsbuild', 'rspack', 'vite', 'webpack', 'farm'];

  if (process.env.TOOLS === 'all') {
    return allTools;
  }
  if (process.env.TOOLS) {
    return process.env.TOOLS?.split(',').map((item) => item.toLowerCase());
  }

  // Failed to run Farm in GitHub Actions
  // so it is excluded from the default tools
  const defaultTools = ['rsbuild', 'rspack', 'vite', 'webpack'];
  return defaultTools;
};

const toolNames = parseToolNames();
const buildTools = [];

toolNames.forEach((name) => {
  switch (name) {
    case 'rspack':
      buildTools.push(
        new BuildTool({
          name: 'Rspack CLI ' + require('@rspack/core/package.json').version,
          port: 8080,
          startScript: 'start:rspack',
          startedRegex: /in (.+) (s|ms)/,
          buildScript: 'build:rspack',
          binFilePath: '@rspack/cli/bin/rspack.js',
        }),
        new BuildTool({
          name:
            'Rspack CLI (Lazy) ' + require('@rspack/core/package.json').version,
          port: 8080,
          startScript: 'start:rspack:lazy',
          startedRegex: /in (.+) (s|ms)/,
          buildScript: 'build:rspack',
          binFilePath: '@rspack/cli/bin/rspack.js',
        }),
      );
      break;
    case 'rsbuild':
      buildTools.push(
        new BuildTool({
          name: 'Rsbuild ' + require('@rsbuild/core/package.json').version,
          port: 3000,
          startScript: 'start:rsbuild',
          startedRegex: /in (.+) (s|ms)/,
          buildScript: 'build:rsbuild',
          binFilePath: '@rsbuild/core/bin/rsbuild.js',
        }),
        new BuildTool({
          name:
            'Rsbuild (Lazy) ' + require('@rsbuild/core/package.json').version,
          port: 3000,
          startScript: 'start:rsbuild:lazy',
          startedRegex: /in (.+) (s|ms)/,
          buildScript: 'build:rsbuild',
          binFilePath: '@rsbuild/core/bin/rsbuild.js',
        }),
      );
      break;
    case 'vite':
      buildTools.push(
        new BuildTool({
          name: 'Vite (SWC) ' + require('vite/package.json').version,
          port: 5173,
          startScript: 'start:vite',
          startedRegex: /ready in (\d+) (s|ms)/,
          buildScript: 'build:vite',
          binFilePath: 'vite/bin/vite.js',
        }),
      );
      break;
    case 'webpack':
      buildTools.push(
        new BuildTool({
          name: 'webpack (SWC) ' + require('webpack/package.json').version,
          port: 8082,
          startScript: 'start:webpack',
          startedRegex: /compiled .+ in (.+) (s|ms)/,
          buildScript: 'build:webpack',
          binFilePath: 'webpack-cli/bin/cli.js',
        }),
      );
      break;
    case 'farm':
      buildTools.push(
        new BuildTool({
          name: 'Farm ' + require('@farmfe/core/package.json').version,
          port: 9000,
          startScript: 'start:farm',
          startedRegex: /Ready in (.+)(s|ms)/,
          buildScript: 'build:farm',
          binFilePath: '@farmfe/cli/bin/farm.mjs',
        }),
      );
      break;
  }
});

const browser = await puppeteer.launch();
const warmupTimes = Number(process.env.WARMUP_TIMES) || 1;
const runTimes = Number(process.env.RUN_TIMES) || 5;
const totalTimes = warmupTimes + runTimes;

logger.log('');
logger.start(
  'Benchmark case ' +
    color.green(`"${caseName}"`) +
    ' will run ' +
    color.green(warmupTimes + ' warmup') +
    ' + ' +
    color.green(runTimes + ' measured') +
    ' times',
);

let totalResults = [];

for (let i = 0; i < totalTimes; i++) {
  await runBenchmark();
}

async function runBenchmark() {
  const results = {};

  for (const buildTool of buildTools) {
    const time = await buildTool.startServer();
    const page = await browser.newPage();
    const start = Date.now();

    page.on('load', () => {
      const loadTime = Date.now() - start;
      logger.success(
        color.dim(buildTool.name) +
          ' startup in ' +
          color.green(time + loadTime + 'ms'),
      );

      if (!results[buildTool.name]) {
        results[buildTool.name] = {};
      }

      results[buildTool.name].startup = time + loadTime;
      results[buildTool.name].serverStart = time;
      results[buildTool.name].onLoad = loadTime;
    });

    logger.info(
      color.dim('navigating to' + ` http://localhost:${buildTool.port}`),
    );

    await page.goto(`http://localhost:${buildTool.port}`, {
      timeout: 60000,
    });

    let waitResolve = null;
    const waitPromise = new Promise((resolve) => {
      waitResolve = resolve;
    });

    let hmrRootStart = -1;
    let hmrLeafStart = -1;

    page.on('console', (event) => {
      const isFinished = () => {
        return (
          results[buildTool.name]?.rootHmr && results[buildTool.name]?.leafHmr
        );
      };
      if (event.text().includes('root hmr')) {
        const clientDateNow = /(\d+)/.exec(event.text())[1];
        const hmrTime = clientDateNow - hmrRootStart;
        logger.success(
          color.dim(buildTool.name) +
            ' root HMR in ' +
            color.green(hmrTime + 'ms'),
        );

        results[buildTool.name].rootHmr = hmrTime;
        if (isFinished()) {
          page.close();
          waitResolve();
        }
      } else if (event.text().includes('leaf hmr')) {
        const hmrTime = Date.now() - hmrLeafStart;
        logger.success(
          color.dim(buildTool.name) +
            ' leaf HMR in ' +
            color.green(hmrTime + 'ms'),
        );
        results[buildTool.name].leafHmr = hmrTime;
        if (isFinished()) {
          page.close();
          waitResolve();
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const rootFilePath = path.join(__dirname, 'src', caseName, 'f0.jsx');
    const originalRootFileContent = readFileSync(rootFilePath, 'utf-8');

    appendFile(
      rootFilePath,
      `
    console.log('root hmr', Date.now());
    `,
      (err) => {
        if (err) throw err;
        hmrRootStart = Date.now();
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const leafFilePath = path.join(
      __dirname,
      'src',
      caseName,
      'd0/d0/d0/f0.jsx',
    );
    const originalLeafFileContent = readFileSync(leafFilePath, 'utf-8');
    appendFile(
      leafFilePath,
      `
      console.log('leaf hmr', Date.now());
      `,
      (err) => {
        if (err) throw err;
        hmrLeafStart = Date.now();
      },
    );

    await waitPromise;

    // restore files
    writeFileSync(rootFilePath, originalRootFileContent);
    writeFileSync(leafFilePath, originalLeafFileContent);

    buildTool.stopServer();

    await new Promise((resolve) => setTimeout(resolve, 500));
    logger.success(color.dim(buildTool.name) + ' dev server closed');

    const buildTime = await buildTool.build();
    logger.success(
      color.dim(buildTool.name) + ' built in ' + color.green(buildTime + ' ms'),
    );
    results[buildTool.name].prodBuild = buildTime;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  totalResults.push(results);
}

// average results
const averageResults = {};

// drop the warmup results
totalResults = totalResults.slice(warmupTimes);

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
    averageResults[name][key] = Math.floor(value / totalResults.length) + 'ms';
  }
}

logger.log('');
logger.success('Benchmark finished');
logger.success('Average results of ' + totalResults.length + ' runs:');
console.table(averageResults);

process.exit(0);
