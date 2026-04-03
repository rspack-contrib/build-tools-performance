import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import glob from 'fast-glob';
import { gzipSizeSync } from 'gzip-size';
import { markdownTable } from 'markdown-table';
import ts from 'typescript';

type ToolId = 'rspack' | 'vite' | 'rolldown' | 'rollup';

type Tool = {
  id: ToolId;
  label: string;
  packageName: string;
  buildScript: string;
};

type LibraryEntry = {
  name: string;
  importTexts: string[];
  initializerText: string;
};

type SizeInfo = {
  outputBytes: number;
  gzipBytes: number;
};

type ToolResult =
  | ({
      ok: true;
    } & SizeInfo)
  | {
      ok: false;
      error: string;
    };

type LibraryResult = {
  name: string;
  toolResults: Record<ToolId, ToolResult>;
};

const require = createRequire(import.meta.url);
const repoRoot = path.join(import.meta.dirname, '..');
const caseDir = path.join(repoRoot, 'cases/popular-libs');
const sourcePath = path.join(caseDir, 'src/index.js');
const distDir = path.join(caseDir, 'dist');
const tempEntryPath = path.join(
  caseDir,
  'src/__popular_libs_size_report_entry__.js',
);
const reportPath = path.join(repoRoot, 'reports/popular-libs-size-report.md');

const tools: Tool[] = [
  {
    id: 'rspack',
    label: 'Rspack',
    packageName: '@rspack/core',
    buildScript: 'build:rspack',
  },
  {
    id: 'vite',
    label: 'Vite',
    packageName: 'vite',
    buildScript: 'build:vite',
  },
  {
    id: 'rolldown',
    label: 'Rolldown',
    packageName: 'rolldown',
    buildScript: 'build:rolldown',
  },
  {
    id: 'rollup',
    label: 'Rollup',
    packageName: 'rollup',
    buildScript: 'build:rollup',
  },
];

function formatSize(bytes: number): string {
  const value = bytes / 1000;
  return value.toFixed(value < 1 ? 2 : 1);
}

function formatCell(result: ToolResult): string {
  if (!result.ok) {
    return 'N/A';
  }
  return `${formatSize(result.outputBytes)} (${formatSize(result.gzipBytes)})`;
}

function formatGap(bytes: number): string {
  return `+${formatSize(bytes)} kB`;
}

function getPackageVersion(packageName: string): string {
  return require(`${packageName}/package.json`).version as string;
}

function getPropertyNameText(name: ts.PropertyName): string {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text;
  }
  throw new Error(
    `Unsupported property name kind: ${ts.SyntaxKind[name.kind]}`,
  );
}

function collectImportLocals(
  importClause: ts.ImportClause | undefined,
  locals: Set<string>,
): void {
  if (!importClause) {
    return;
  }

  if (importClause.name) {
    locals.add(importClause.name.text);
  }

  if (!importClause.namedBindings) {
    return;
  }

  if (ts.isNamespaceImport(importClause.namedBindings)) {
    locals.add(importClause.namedBindings.name.text);
    return;
  }

  for (const element of importClause.namedBindings.elements) {
    locals.add(element.name.text);
  }
}

function collectReferencedImportLocals(
  node: ts.Node,
  knownLocals: Set<string>,
  referencedLocals: Set<string>,
): void {
  if (ts.isPropertyAssignment(node)) {
    collectReferencedImportLocals(
      node.initializer,
      knownLocals,
      referencedLocals,
    );
    return;
  }

  if (ts.isShorthandPropertyAssignment(node)) {
    if (knownLocals.has(node.name.text)) {
      referencedLocals.add(node.name.text);
    }
    if (node.objectAssignmentInitializer) {
      collectReferencedImportLocals(
        node.objectAssignmentInitializer,
        knownLocals,
        referencedLocals,
      );
    }
    return;
  }

  if (ts.isPropertyAccessExpression(node)) {
    collectReferencedImportLocals(
      node.expression,
      knownLocals,
      referencedLocals,
    );
    return;
  }

  if (ts.isIdentifier(node) && knownLocals.has(node.text)) {
    referencedLocals.add(node.text);
  }

  node.forEachChild((child) => {
    collectReferencedImportLocals(child, knownLocals, referencedLocals);
  });
}

function extractLibraries(sourceText: string): LibraryEntry[] {
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );

  const importRecords: Array<{ text: string; locals: Set<string> }> = [];
  const knownImportLocals = new Set<string>();
  let importedLibrariesObject: ts.ObjectLiteralExpression | undefined;

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const locals = new Set<string>();
      collectImportLocals(statement.importClause, locals);
      locals.forEach((local) => knownImportLocals.add(local));
      importRecords.push({
        text: statement.getText(sourceFile),
        locals,
      });
      continue;
    }

    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === 'importedLibraries' &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        importedLibrariesObject = declaration.initializer;
      }
    }
  }

  if (!importedLibrariesObject) {
    throw new Error(
      'Unable to find the importedLibraries object in popular-libs',
    );
  }

  const libraries: LibraryEntry[] = [];

  for (const property of importedLibrariesObject.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const name = getPropertyNameText(property.name);
    const referencedLocals = new Set<string>();
    collectReferencedImportLocals(
      property.initializer,
      knownImportLocals,
      referencedLocals,
    );

    const importTexts = importRecords
      .filter((record) =>
        [...record.locals].some((local) => referencedLocals.has(local)),
      )
      .map((record) => record.text);

    libraries.push({
      name,
      importTexts,
      initializerText: property.initializer.getText(sourceFile),
    });
  }

  return libraries;
}

function createEntrySource(library: LibraryEntry): string {
  return [
    '// @ts-check',
    ...library.importTexts,
    '',
    `const importedLibrary = ${library.initializerText};`,
    '',
    'console.log(importedLibrary);',
    '',
  ].join('\n');
}

async function runBuild(tool: Tool): Promise<void> {
  await rm(distDir, { recursive: true, force: true });

  await new Promise<void>((resolve, reject) => {
    const child = spawn('node', ['--run', tool.buildScript], {
      cwd: caseDir,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NO_COLOR: '1',
        POPULAR_LIBS_ENTRY: tempEntryPath,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';

    child.stdout?.on('data', (chunk: Buffer | string) => {
      output += chunk.toString();
    });
    child.stderr?.on('data', (chunk: Buffer | string) => {
      output += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      const tail = output.trim().split('\n').slice(-20).join('\n');
      reject(
        new Error(
          `${tool.label} build failed with exit code ${code ?? 'unknown'}\n${tail}`,
        ),
      );
    });
  });
}

async function collectDistSize(): Promise<SizeInfo> {
  const files = await glob('**/*', {
    absolute: true,
    cwd: distDir,
    dot: true,
    onlyFiles: true,
  });

  const validFiles = files.filter((file) => {
    return !(file.endsWith('.map') || file.endsWith('.LICENSE.txt'));
  });

  let outputBytes = 0;
  let gzipBytes = 0;

  for (const file of validFiles) {
    const content = await readFile(file);
    outputBytes += content.byteLength;
    gzipBytes += gzipSizeSync(content);
  }

  return {
    outputBytes,
    gzipBytes,
  };
}

function renderMainTable(results: LibraryResult[]): string {
  return markdownTable([
    ['Library', ...tools.map((tool) => tool.label)],
    ...results.map((result) => [
      result.name,
      ...tools.map((tool) => formatCell(result.toolResults[tool.id])),
    ]),
  ]);
}

function renderRspackOpportunities(results: LibraryResult[]): string {
  const rows = results
    .map((result) => {
      const rspackResult = result.toolResults.rspack;
      if (!rspackResult.ok) {
        return null;
      }

      const competitorResults = tools
        .filter((tool) => tool.id !== 'rspack')
        .map((tool) => ({
          tool,
          result: result.toolResults[tool.id],
        }))
        .filter(
          (
            entry,
          ): entry is {
            tool: Tool;
            result: Extract<ToolResult, { ok: true }>;
          } => entry.result.ok,
        );

      if (competitorResults.length === 0) {
        return null;
      }

      const bestOutput = competitorResults.reduce((best, current) => {
        return current.result.outputBytes < best.result.outputBytes
          ? current
          : best;
      });
      const bestGzip = competitorResults.reduce((best, current) => {
        return current.result.gzipBytes < best.result.gzipBytes
          ? current
          : best;
      });

      const outputGapBytes = Math.max(
        0,
        rspackResult.outputBytes - bestOutput.result.outputBytes,
      );
      const gzipGapBytes = Math.max(
        0,
        rspackResult.gzipBytes - bestGzip.result.gzipBytes,
      );

      if (outputGapBytes === 0 && gzipGapBytes === 0) {
        return null;
      }

      return {
        name: result.name,
        rspackResult,
        bestOutput,
        bestGzip,
        outputGapBytes,
        gzipGapBytes,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => {
      if (b.gzipGapBytes !== a.gzipGapBytes) {
        return b.gzipGapBytes - a.gzipGapBytes;
      }
      return b.outputGapBytes - a.outputGapBytes;
    });

  if (rows.length === 0) {
    return 'Rspack is already tied for best output size and gzip size on every library in this run.';
  }

  return markdownTable([
    [
      'Library',
      'Rspack raw',
      'Best raw',
      'Raw gap',
      'Rspack gzip',
      'Best gzip',
      'Gzip gap',
    ],
    ...rows.map((row) => [
      row.name,
      `${formatSize(row.rspackResult.outputBytes)} kB`,
      row.outputGapBytes > 0
        ? `${row.bestOutput.tool.label} ${formatSize(row.bestOutput.result.outputBytes)} kB`
        : '-',
      row.outputGapBytes > 0 ? formatGap(row.outputGapBytes) : '-',
      `${formatSize(row.rspackResult.gzipBytes)} kB`,
      row.gzipGapBytes > 0
        ? `${row.bestGzip.tool.label} ${formatSize(row.bestGzip.result.gzipBytes)} kB`
        : '-',
      row.gzipGapBytes > 0 ? formatGap(row.gzipGapBytes) : '-',
    ]),
  ]);
}

function renderReport(results: LibraryResult[]): string {
  const toolVersions = tools
    .map((tool) => `${tool.label} ${getPackageVersion(tool.packageName)}`)
    .join(', ');

  const rspackOpportunityCount = results.filter((result) => {
    const rspackResult = result.toolResults.rspack;
    if (!rspackResult.ok) {
      return false;
    }

    return tools
      .filter((tool) => tool.id !== 'rspack')
      .some((tool) => {
        const competitorResult = result.toolResults[tool.id];
        return (
          competitorResult.ok &&
          (competitorResult.outputBytes < rspackResult.outputBytes ||
            competitorResult.gzipBytes < rspackResult.gzipBytes)
        );
      });
  }).length;

  return [
    '# popular-libs 细粒度产物体积对比报告',
    '',
    `- 生成时间: ${new Date().toISOString()}`,
    `- 对比工具: ${toolVersions}`,
    `- 库数量: ${results.length}`,
    `- Rspack 有提升空间的 case 数量: ${rspackOpportunityCount}`,
    '- 统计口径: 对每个库单独生成一个入口并做 production build，统计 `dist/` 中所有非 `.map`、非 `.LICENSE.txt` 文件的总产物大小及 gzip 大小。',
    '- 说明: 细粒度报告模式下关闭了 Rspack / Rollup 的 HTML 壳输出，避免 HTML 固定开销影响小体积库的对比；因此本报告与 README 中的整包总量不能直接逐项相加或一一对应。',
    '- 单元格格式: `raw (gzip)`，单位 `kB`。',
    '',
    '## 逐库对比',
    '',
    renderMainTable(results),
    '',
    '## Rspack 有提升空间的 case',
    '',
    '下表列出 Rspack 在 raw size 或 gzip size 上落后于最优解的库，便于针对性优化。',
    '',
    renderRspackOpportunities(results),
    '',
    '## 复现命令',
    '',
    '```bash',
    'node ./scripts/generate-popular-libs-size-report.ts',
    '```',
    '',
  ].join('\n');
}

async function main(): Promise<void> {
  const sourceText = await readFile(sourcePath, 'utf8');
  const libraries = extractLibraries(sourceText);
  const results: LibraryResult[] = [];

  console.log(`Found ${libraries.length} libraries in popular-libs`);

  try {
    for (const [libraryIndex, library] of libraries.entries()) {
      console.log(`[${libraryIndex + 1}/${libraries.length}] ${library.name}`);
      await writeFile(tempEntryPath, createEntrySource(library), 'utf8');

      const toolResults = {} as Record<ToolId, ToolResult>;

      for (const tool of tools) {
        process.stdout.write(`  - ${tool.label}... `);
        try {
          await runBuild(tool);
          const sizeInfo = await collectDistSize();
          toolResults[tool.id] = {
            ok: true,
            ...sizeInfo,
          };
          console.log(
            `${formatSize(sizeInfo.outputBytes)} / ${formatSize(sizeInfo.gzipBytes)} kB`,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message.split('\n')[0]
              : String(error);
          toolResults[tool.id] = {
            ok: false,
            error: message,
          };
          console.log(`FAILED (${message})`);
        }
      }

      results.push({
        name: library.name,
        toolResults,
      });
    }
  } finally {
    await rm(tempEntryPath, { force: true });
    await rm(distDir, { recursive: true, force: true });
  }

  const report = renderReport(results);
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, report, 'utf8');

  console.log(`Report written to ${reportPath}`);
}

await main();
