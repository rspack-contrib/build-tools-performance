// @ts-check
import { spawn } from 'child_process';
import { appendFile, readFileSync, writeFileSync } from 'node:fs';
import fse from 'fs-extra';
import { createRequire } from 'module';
import path from 'path';
import puppeteer from 'puppeteer';
import kill from 'tree-kill';
import { logger } from 'rslog';
import color from 'picocolors';
import { markdownTable } from 'markdown-table';
import { caseName } from './shared/constants.mjs';
import {
  getFileSizes,
  addRankingEmojis,
  shuffleArray,
} from './shared/utils.mjs';

process.env.CASE = caseName;

async function coolDown() {
  if (global.gc) {
    global.gc();
  }
  const COOL_DOWN_TIME = 3000;
  await new Promise((resolve) => setTimeout(resolve, COOL_DOWN_TIME));
}

const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname;
const caseDir = path.join(__dirname, 'cases', caseName);
const srcDir = path.join(caseDir, 'src');
const distDir = path.join(caseDir, 'dist');
const { config } = await import(`./cases/${caseName}/benchmark-config.mjs`);
const runDev = config.dev !== false;

const startConsole = "console.log('Benchmark Start Time', Date.now());";
const startConsoleRegex = /Benchmark Start Time (\d+)/;

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
      [__dirname, caseDir].forEach((dir) => {
        fse.removeSync(path.join(dir, './.parcel-cache'));
        fse.removeSync(path.join(dir, './node_modules/.cache'));
        fse.removeSync(path.join(dir, './node_modules/.vite'));
        fse.removeSync(path.join(dir, './node_modules/.farm'));
      });
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
    logger.log('');
    logger.start(
      `Running start command: ${color.bold(color.yellow(this.startScript))}`,
    );
    return new Promise((resolve, reject) => {
      const child = spawn(
        `cd cases/${caseName} && node --run ${this.startScript}`,
        {
          stdio: ['pipe'],
          shell: true,
          env: {
            ...process.env,
            NO_COLOR: '1',
          },
        },
      );
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
        console.log(`stderr: ${data}`);
      });

      child.on('error', (error) => {
        logger.error(`${error.message}`);
        reject(error);
      });
      child.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          logger.error(
            `(${this.name} run ${this.startScript} failed) child process exited with code ${code}`,
          );
          reject(code);
        }
      });
    });
  }

  stopServer() {
    if (this.child) {
      kill(this.child.pid ?? 0);
    }
  }

  async build() {
    logger.log('');
    logger.start(
      `Running build command: ${color.bold(color.yellow(this.buildScript))}`,
    );
    const child = spawn(
      `cd cases/${caseName} && node --run ${this.buildScript}`,
      {
        stdio: ['pipe'],
        shell: true,
        env: {
          ...process.env,
          NO_COLOR: '1',
        },
      },
    );
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
  if (process.env.TOOLS === 'all') {
    return config.supportedTools;
  }
  if (process.env.TOOLS) {
    return process.env.TOOLS?.split(',').map((item) => item.toLowerCase());
  }
  return config.defaultTools ?? config.supportedTools;
};
const buildTools = [];
parseToolNames().forEach((name) => {
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
      );
      break;
    case 'vite':
      buildTools.push(
        new BuildTool({
          name: 'Vite (Rollup + SWC) ' + require('vite/package.json').version,
          port: 5173,
          startScript: 'start:vite',
          startedRegex: /ready in (\d+) (s|ms)/,
          buildScript: 'build:vite',
          binFilePath: 'vite/bin/vite.js',
        }),
      );
      break;
    case 'rolldown':
      buildTools.push(
        new BuildTool({
          name: 'Rolldown ' + require('rolldown/package.json').version,
          port: 5173,
          startScript: 'start:rolldown',
          startedRegex: /Finished in (\d+) (s|ms)/,
          buildScript: 'build:rolldown',
          binFilePath: 'rolldown/bin/cli.mjs',
        }),
      );
      break;
    case 'rolldown-vite':
      buildTools.push(
        new BuildTool({
          name:
            'Vite (Rolldown + Oxc) ' +
            require('rolldown-vite/package.json').version,
          port: 5173,
          startScript: 'start:rolldown-vite',
          startedRegex: /ready in (\d+) (s|ms)/,
          buildScript: 'build:rolldown-vite',
          binFilePath: 'rolldown-vite/bin/vite.js',
        }),
      );
      break;
    case 'webpack':
      buildTools.push(
        new BuildTool({
          name: 'webpack (SWC) ' + require('webpack/package.json').version,
          port: 8080,
          startScript: 'start:webpack',
          startedRegex: /compiled .+ in (.+) (s|ms)/,
          buildScript: 'build:webpack',
          binFilePath: 'webpack-cli/bin/cli.js',
        }),
      );
      break;
    case 'esbuild':
      buildTools.push(
        new BuildTool({
          name: 'esbuild ' + require('esbuild/package.json').version,
          port: 8080,
          startScript: 'start:esbuild',
          startedRegex: /esbuild built in (\d+) ms/,
          buildScript: 'build:esbuild',
          binFilePath: 'esbuild/bin/esbuild',
        }),
      );
      break;
    case 'parcel':
      buildTools.push(
        new BuildTool({
          name: 'Parcel ' + require('parcel/package.json').version,
          port: 3200,
          startScript: 'start:parcel',
          startedRegex: /Built in (.+)(s|ms)/,
          buildScript: 'build:parcel',
          binFilePath: 'parcel/lib/bin.js',
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
const { WARMUP_TIMES, RUN_TIMES } = process.env;
const warmupTimes = WARMUP_TIMES ? Number(WARMUP_TIMES) : 2;
const runTimes = RUN_TIMES ? Number(RUN_TIMES) : 3;
const totalTimes = warmupTimes + runTimes;

logger.log('');
logger.info(
  'Benchmark case ' +
    color.green(`"${caseName}"`) +
    ' will run ' +
    color.green(warmupTimes + ' warmup') +
    ' + ' +
    color.green(runTimes + ' measured') +
    ' times',
);

let perfResults = [];
let sizeResults = {};

for (let i = 0; i < totalTimes; i++) {
  await benchAllCases();
}

async function runDevBenchmark(buildTool, perfResult) {
  buildTool.cleanCache();
  const time = await buildTool.startServer();
  const page = await browser.newPage();
  const start = Date.now();

  logger.info(
    color.dim('navigating to' + ` http://localhost:${buildTool.port}`),
  );

  await page.goto(`http://localhost:${buildTool.port}`, {
    timeout: 60000,
  });

  // wait for render element
  await page.waitForSelector('#root > *', {
    timeout: 60000,
  });
  const loadTime = Date.now() - start;
  logger.success(
    color.dim(buildTool.name) +
      ' dev cold start in ' +
      color.green(time + loadTime + 'ms'),
  );
  perfResult[buildTool.name].devColdStart = time + loadTime;

  let waitResolve = null;
  const waitPromise = new Promise((resolve) => {
    waitResolve = resolve;
  });

  let hmrRootStart = -1;
  let hmrLeafStart = -1;

  page.on('console', (event) => {
    const afterHMR = () => {
      const currentResult = perfResult[buildTool.name];
      if (currentResult?.rootHmr && currentResult?.leafHmr) {
        currentResult.hmr = (currentResult.rootHmr + currentResult.leafHmr) / 2;
        page.close();
        waitResolve();
      }
    };

    if (event.text().includes('root hmr')) {
      const match = /(\d+)/.exec(event.text());
      if (!match) {
        throw new Error('Failed to match root HMR time.');
      }

      const clientDateNow = Number(match[1]);
      const hmrTime = clientDateNow - hmrRootStart;
      logger.success(
        color.dim(buildTool.name) +
          ' HMR (root module) in ' +
          color.green(hmrTime + 'ms'),
      );

      perfResult[buildTool.name].rootHmr = hmrTime;
      afterHMR();
    } else if (event.text().includes('leaf hmr')) {
      const match = /(\d+)/.exec(event.text());
      if (!match) {
        throw new Error('Failed to match leaf HMR time.');
      }

      const clientDateNow = Number(match[1]);
      const hmrTime = clientDateNow - hmrLeafStart;
      logger.success(
        color.dim(buildTool.name) +
          ' HMR (leaf module) in ' +
          color.green(hmrTime + 'ms'),
      );
      perfResult[buildTool.name].leafHmr = hmrTime;
      afterHMR();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const rootFilePath = path.join(srcDir, config.rootFile);
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

  const leafFilePath = path.join(srcDir, config.leafFile);
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

  await coolDown();
  logger.success(color.dim(buildTool.name) + ' dev server closed');
}

async function runBuildBenchmark(buildTool, perfResult) {
  buildTool.cleanCache();
  // Clean up dist dir
  await fse.remove(distDir);

  const buildTime = await buildTool.build();

  const sizes = sizeResults[buildTool.name] || (await getFileSizes(distDir));
  sizeResults[buildTool.name] = sizes;

  logger.success(
    color.dim(buildTool.name) + ' built in ' + color.green(buildTime + 'ms'),
  );
  logger.success(
    color.dim(buildTool.name) + ' total size: ' + color.green(sizes.totalSize),
  );
  logger.success(
    color.dim(buildTool.name) +
      ' gzipped size: ' +
      color.green(sizes.totalGzipSize),
  );

  perfResult[buildTool.name].prodBuild = buildTime;

  await coolDown();
}

async function benchAllCases() {
  const perfResult = {};
  // Shuffle the build tools to avoid the cache effect
  const shuffledBuildTools = shuffleArray([...buildTools]);

  for (const buildTool of shuffledBuildTools) {
    if (!perfResult[buildTool.name]) {
      perfResult[buildTool.name] = {};
    }
    if (runDev) {
      await runDevBenchmark(buildTool, perfResult);
    }
    await runBuildBenchmark(buildTool, perfResult);
  }

  perfResults.push(perfResult);
}

// Calculate average results
const averageResults = {};

// Drop the warmup results
perfResults = perfResults.slice(warmupTimes);

for (const result of perfResults) {
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
    averageResults[name][key] = Math.floor(value / perfResults.length) + 'ms';
  }
  // Append size info
  Object.assign(averageResults[name], sizeResults[name]);
}

logger.log('');
logger.success('Benchmark finished!\n');

const genGetData = function (fieldName) {
  return function () {
    const data = buildTools.map(({ name }) => averageResults[name][fieldName]);
    if (data.some((item) => item === undefined)) {
      // Return null means this column no data,
      // and this column will be hidden
      return null;
    }
    addRankingEmojis(data);
    return data;
  };
};

const columns = [
  {
    title: 'Name',
    getData() {
      return buildTools.map(({ name }) => name);
    },
  },
  {
    title: 'Dev cold start',
    getData: genGetData('devColdStart'),
  },
  { title: 'hmr', getData: genGetData('hmr') },
  { title: 'Prod build', getData: genGetData('prodBuild') },
  { title: 'Total size', getData: genGetData('totalSize') },
  { title: 'Gzipped size', getData: genGetData('totalGzipSize') },
];

/** @type {string[][]} */
const datas = columns
  .map((item) => {
    const data = item.getData();
    if (data !== null) {
      // inject title as first
      data.unshift(item.title);
    }
    return data;
  })
  .filter(Boolean);

const markdownLogs = markdownTable(
  [...Array(datas[0].length)].map((_, index) => {
    return datas.map((item) => item[index]);
  }),
);

console.log(markdownLogs + '\n');

process.exit(0);
