import { spawn, type ChildProcess } from 'node:child_process';
import { appendFile, readFileSync, writeFileSync } from 'node:fs';
import fse from 'fs-extra';
import { createRequire } from 'module';
import path from 'path';
import puppeteer, {
  type Browser,
  type ConsoleMessage,
  type Page,
} from 'puppeteer';
import kill from 'tree-kill';
import { logger } from 'rslog';
import color from 'picocolors';
import pidusage from 'pidusage';
import { markdownTable } from 'markdown-table';
import { caseName } from '../shared/constants.mjs';
import { getFileSizes, addRankingEmojis, shuffleArray } from './utils.ts';

process.env.CASE = caseName;

declare global {
  // Exposed when running Node with --expose-gc; allow optional presence.
  // eslint-disable-next-line no-var
  var gc: NodeJS.GCFunction | undefined;
}

type BenchmarkConfig = {
  supportedTools: string[];
  defaultTools?: string[];
  dev?: boolean;
  rootFile?: string;
  leafFile?: string;
};

type DevServerResult = {
  time: number;
  rss: number;
  stopServer: () => void;
};

type BuildResult = {
  time: number;
  rss: number;
};

type NumericPerfMetricKey =
  | 'devColdStart'
  | 'devHotStart'
  | 'devRSS'
  | 'rootHmr'
  | 'leafHmr'
  | 'hmr'
  | 'prodBuild'
  | 'prodHotBuild'
  | 'buildRSS';

interface PerfMetrics extends Partial<Record<NumericPerfMetricKey, number>> {
  outputSize?: string;
  gzippedSize?: string;
}

type PerfResultMap = Partial<Record<string, PerfMetrics>>;
type FileSizes = Awaited<ReturnType<typeof getFileSizes>>;

interface Column {
  title: string;
  data: string[] | null;
}

const COOL_DOWN_TIME = 3000;

async function coolDown(): Promise<void> {
  global.gc?.();
  await new Promise<void>((resolve) => setTimeout(resolve, COOL_DOWN_TIME));
}

const ensureMetrics = (
  perfResult: PerfResultMap,
  toolName: string,
): PerfMetrics => {
  if (!perfResult[toolName]) {
    perfResult[toolName] = {};
  }
  return perfResult[toolName]!;
};

const require = createRequire(import.meta.url);
const monorepoRoot = path.join(import.meta.dirname, '../');
const caseDir = path.join(monorepoRoot, 'cases', caseName);
const srcDir = path.join(caseDir, 'src');
const distDir = path.join(caseDir, 'dist');
type ConfigModule = {
  config: BenchmarkConfig;
};
const { config } = (await import(
  `../cases/${caseName}/benchmark-config.mjs`
)) as ConfigModule;
const runDev = config.dev !== false;

const startConsole = `console.log('Benchmark Start Time:', Date.now());
console.log('Current PID:', process.pid);
process.on('exit', function() {
  console.log('Memory Usage:', process.memoryUsage().rss);
});
`;

interface BuildToolOptions {
  name: string;
  port: number;
  startScript: string;
  startedRegex: RegExp;
  buildScript: string;
  binFilePath: string;
}

class BuildTool {
  public readonly name: string;
  public readonly port: number;
  private readonly startScript: string;
  private readonly startedRegex: RegExp;
  private readonly buildScript: string;
  private readonly binFilePath: string;
  private child?: ChildProcess;

  constructor({
    name,
    port,
    startScript,
    startedRegex,
    buildScript,
    binFilePath,
  }: BuildToolOptions) {
    this.name = name;
    this.port = port;
    this.startScript = startScript;
    this.startedRegex = startedRegex;
    this.buildScript = buildScript;
    this.binFilePath = path.join(process.cwd(), 'node_modules', binFilePath);
    this.hackBinFile();
  }

  cleanCache(): void {
    try {
      [monorepoRoot, caseDir].forEach((dir) => {
        fse.removeSync(path.join(dir, './.parcel-cache'));
        fse.removeSync(path.join(dir, './node_modules/.cache'));
        fse.removeSync(path.join(dir, './node_modules/.vite'));
        fse.removeSync(path.join(dir, './node_modules/.farm'));
      });
    } catch {
      // ignore cache cleanup failures so benchmarks can continue
    }
  }

  // Add a `console.log('Benchmark start', Date.now())` to the bin file's second line
  private hackBinFile(): void {
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

  async startServer(): Promise<DevServerResult> {
    logger.log('');
    logger.start(
      `Running start command: ${color.bold(color.yellow(this.startScript))}`,
    );

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
    const stdout = child.stdout;
    const stderr = child.stderr;

    if (!stdout || !stderr) {
      throw new Error('Failed to capture child process output');
    }

    if (process.env.DEBUG) {
      stdout.on('data', (data: Buffer) => {
        console.log(data.toString());
      });
    }
    stderr.on('data', (data: Buffer) => {
      logger.log(`stderr: ${data}`);
    });

    const stopServer = function () {
      if (child.pid) {
        kill(child.pid);
      }
    };

    return new Promise<DevServerResult>((resolve, reject) => {
      let startTime: number | null = null;
      let bundlerPid: number | null = null;
      let timeUsage: number | null = null;

      stdout.on('data', (data: Buffer) => {
        const text = data.toString();

        const startMatch = /Benchmark Start Time: (\d+)/.exec(text);
        if (startMatch) {
          startTime = Number(startMatch[1]);
        }

        const matchPid = /Current PID: (\d+)/.exec(text);
        if (matchPid) {
          bundlerPid = Number(matchPid[1]);
        }

        if (this.startedRegex.test(text)) {
          this.startedRegex.lastIndex = 0;
          if (startTime === null) {
            reject(new Error('Start time not found'));
            return;
          }
          if (timeUsage === null) {
            timeUsage = Date.now() - startTime;
            if (!bundlerPid) {
              reject(new Error('Bundler pid not found'));
              return;
            }
            pidusage(bundlerPid, function (err, info) {
              if (err) {
                reject(err);
                return;
              }
              const rssRaw = info.memory / 1024 / 1024;
              const rss = Math.round(rssRaw * 1000) / 1000;
              resolve({ time: timeUsage!, rss, stopServer });
            });
          }
        }
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
          reject(new Error(String(code)));
        }
      });
    });
  }

  async build(): Promise<BuildResult> {
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
    const stdout = child.stdout;

    if (!stdout) {
      throw new Error('Failed to capture build output');
    }

    const startTime = Date.now();
    let buildRss: number | null = null;
    stdout.on('data', (data: Buffer) => {
      const text = data.toString();
      const matchRss = /Memory Usage: (\d+)/.exec(text);
      if (matchRss) {
        // transform to MB
        const rss = Number(matchRss[1]) / 1024 / 1024;
        buildRss = Math.round(rss * 1000) / 1000;
      }
    });
    return new Promise<BuildResult>((resolve, reject) => {
      child.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Build failed with exit code ${code}`));
          return;
        }
        if (!buildRss) {
          reject(new Error('buildRss not found'));
          return;
        }
        resolve({ time: Date.now() - startTime, rss: buildRss });
      });
      child.on('error', reject);
    });
  }
}

const parseToolNames = (): string[] => {
  if (process.env.TOOLS === 'all') {
    return config.supportedTools;
  }
  if (process.env.TOOLS) {
    return process.env.TOOLS?.split(',').map((item) => item.toLowerCase());
  }
  return config.defaultTools ?? config.supportedTools;
};
const buildTools: BuildTool[] = [];
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
          name: 'Vite (Rollup) ' + require('vite/package.json').version,
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
            'Vite (Rolldown) ' + require('rolldown-vite/package.json').version,
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
          binFilePath: 'esbuild/lib/main.js',
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

const browser: Browser = await puppeteer.launch();
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

let perfResults: PerfResultMap[] = [];
const sizeResults: Partial<Record<string, FileSizes>> = {};

for (let i = 0; i < totalTimes; i++) {
  await benchAllCases();
}

async function runDevBenchmark(
  buildTool: BuildTool,
  perfResult: PerfResultMap,
): Promise<void> {
  const metrics = ensureMetrics(perfResult, buildTool.name);
  const { rootFile, leafFile } = config;
  if (!rootFile || !leafFile) {
    throw new Error(
      'Dev benchmarks require both rootFile and leafFile in the case config.',
    );
  }

  buildTool.cleanCache();
  const { time, rss, stopServer } = await buildTool.startServer();
  metrics.devRSS = rss;
  const page: Page = await browser.newPage();
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
  metrics.devColdStart = time + loadTime;

  let waitResolve!: () => void;
  const waitPromise = new Promise<void>((resolve) => {
    waitResolve = resolve;
  });

  let hmrRootStart = -1;
  let hmrLeafStart = -1;

  page.on('console', (event: ConsoleMessage) => {
    const afterHMR = () => {
      if (
        typeof metrics.rootHmr === 'number' &&
        typeof metrics.leafHmr === 'number'
      ) {
        metrics.hmr = (metrics.rootHmr + metrics.leafHmr) / 2;
        void page.close();
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

      metrics.rootHmr = hmrTime;
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
      metrics.leafHmr = hmrTime;
      afterHMR();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const rootFilePath = path.join(srcDir, rootFile);
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

  const leafFilePath = path.join(srcDir, leafFile);
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

  stopServer();

  await coolDown();
  logger.success(color.dim(buildTool.name) + ' dev server closed');

  // collect memory

  // hot start
  await runHotStartBenchmark(buildTool, perfResult);
}

async function runHotStartBenchmark(
  buildTool: BuildTool,
  perfResult: PerfResultMap,
): Promise<void> {
  const metrics = ensureMetrics(perfResult, buildTool.name);
  const { time, stopServer } = await buildTool.startServer();
  const page: Page = await browser.newPage();
  const start = Date.now();

  logger.info(
    color.dim(
      'navigating to' + ` http://localhost:${buildTool.port} (hot start)`,
    ),
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
      ' dev hot start in ' +
      color.green(time + loadTime + 'ms'),
  );
  metrics.devHotStart = time + loadTime;

  await page.close();

  stopServer();

  await coolDown();
  logger.success(color.dim(buildTool.name) + ' dev server closed (hot start)');
}

async function runBuildBenchmark(
  buildTool: BuildTool,
  perfResult: PerfResultMap,
): Promise<void> {
  const metrics = ensureMetrics(perfResult, buildTool.name);
  buildTool.cleanCache();
  // Clean up dist dir
  await fse.remove(distDir);

  const { time: buildTime, rss } = await buildTool.build();
  if (rss !== null) {
    metrics.buildRSS = rss;
  }

  const sizes = sizeResults[buildTool.name] ?? (await getFileSizes(distDir));
  sizeResults[buildTool.name] = sizes;

  logger.success(
    color.dim(buildTool.name) + ' built in ' + color.green(buildTime + 'ms'),
  );
  logger.success(
    color.dim(buildTool.name) +
      ' output size: ' +
      color.green(sizes.outputSize + 'kB'),
  );
  logger.success(
    color.dim(buildTool.name) +
      ' gzipped size: ' +
      color.green(sizes.gzippedSize + 'kB'),
  );

  metrics.prodBuild = buildTime;

  await coolDown();

  await runHotBuildBenchmark(buildTool, perfResult);
}

async function runHotBuildBenchmark(
  buildTool: BuildTool,
  perfResult: PerfResultMap,
): Promise<void> {
  const metrics = ensureMetrics(perfResult, buildTool.name);
  // Clean up dist dir
  await fse.remove(distDir);

  const { time: buildTime } = await buildTool.build();

  logger.success(
    color.dim(buildTool.name) +
      ' hot built in ' +
      color.green(buildTime + 'ms'),
  );

  metrics.prodHotBuild = buildTime;

  await coolDown();
}

async function benchAllCases(): Promise<void> {
  const perfResult: PerfResultMap = {};
  // Shuffle the build tools to avoid the cache effect
  const shuffledBuildTools = shuffleArray([...buildTools]);

  for (const buildTool of shuffledBuildTools) {
    ensureMetrics(perfResult, buildTool.name);
    if (runDev) {
      await runDevBenchmark(buildTool, perfResult);
    }
    await runBuildBenchmark(buildTool, perfResult);
  }

  perfResults.push(perfResult);
}

// Calculate average results
const averageResults: Record<string, PerfMetrics> = {};

// Drop the warmup results
perfResults = perfResults.slice(warmupTimes);

if (perfResults.length === 0) {
  throw new Error('No measured benchmark runs were collected.');
}

for (const result of perfResults) {
  for (const [name, values] of Object.entries(result)) {
    if (!values) {
      continue;
    }
    const metricBucket = averageResults[name] ?? (averageResults[name] = {});

    for (const [key, rawValue] of Object.entries(values) as [
      keyof PerfMetrics,
      PerfMetrics[keyof PerfMetrics],
    ][]) {
      if (typeof rawValue !== 'number') {
        continue;
      }

      const metricKey = key as NumericPerfMetricKey;
      const previousValue = metricBucket[metricKey] ?? 0;
      metricBucket[metricKey] = previousValue + rawValue;
    }
  }
}

for (const [name, values] of Object.entries(averageResults)) {
  (Object.keys(values) as (keyof PerfMetrics)[]).forEach((key) => {
    const metricValue = values[key];
    if (typeof metricValue === 'number') {
      const numericKey = key as NumericPerfMetricKey;
      values[numericKey] = Math.floor(metricValue / perfResults.length);
    }
  });
  // Append size info
  const sizeInfo = sizeResults[name];
  if (sizeInfo) {
    values.outputSize = sizeInfo.outputSize;
    values.gzippedSize = sizeInfo.gzippedSize;
  }
}

logger.log('');
logger.success('Benchmark finished!\n');

const getData = function (
  fieldName: keyof PerfMetrics,
  unit: string,
): string[] | null {
  const dataset = buildTools.map(
    ({ name }) => averageResults[name]?.[fieldName],
  );
  const hasMissingValue = dataset.some(
    (item): item is undefined => item === undefined,
  );
  if (hasMissingValue) {
    // Return null means this column has no data
    // and should be hidden
    return null;
  }
  const normalized = dataset.map((item) => `${item as number | string}${unit}`);
  addRankingEmojis(normalized);
  return normalized;
};

const buildMarkdownTable = (columns: Column[]): string => {
  const columnsWithData = columns
    .map(({ title, data }) => (data ? [title, ...data] : null))
    .filter((item): item is string[] => item !== null);

  if (columnsWithData.length === 0) {
    throw new Error('No benchmark data available to render.');
  }

  const rows = Array.from({ length: columnsWithData[0].length }, (_, index) =>
    columnsWithData.map((item) => item[index]),
  );

  return markdownTable(rows);
};

const nameColumn: Column = {
  title: 'Name',
  data: buildTools.map(({ name }) => name),
};

const columnGroups: { label: string; columns: Column[] }[] = [];

if (runDev) {
  columnGroups.push({
    label: 'Development metrics',
    columns: [
      nameColumn,
      {
        title: 'Startup (no cache)',
        data: getData('devColdStart', 'ms'),
      },
      {
        title: 'Startup (with cache)',
        data: getData('devHotStart', 'ms'),
      },
      { title: 'HMR', data: getData('hmr', 'ms') },
      {
        title: 'Memory (RSS)',
        data: getData('devRSS', 'MB'),
      },
    ],
  });
}

columnGroups.push({
  label: 'Build metrics',
  columns: [
    nameColumn,
    { title: 'Build (no cache)', data: getData('prodBuild', 'ms') },
    { title: 'Build (with cache)', data: getData('prodHotBuild', 'ms') },
    {
      title: 'Memory (RSS)',
      data: getData('buildRSS', 'MB'),
    },
    { title: 'Output size', data: getData('outputSize', 'kB') },
    {
      title: 'Gzipped size',
      data: getData('gzippedSize', 'kB'),
    },
  ],
});

for (const { label, columns } of columnGroups) {
  logger.log(`${label}:\n`);
  const table = buildMarkdownTable(columns);
  console.log(`${table}\n`);
}

process.exit(0);
