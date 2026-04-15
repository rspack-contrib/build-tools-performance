import { createHash } from 'node:crypto';
import path from 'node:path';
import { gzipSizeSync } from 'gzip-size';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { rspack } from '@rspack/core';
import { parse as swcParse } from '@swc/core';
import { rolldown } from 'rolldown';
import { rollup } from 'rollup';
import glob from 'fast-glob';
import { format as prettierFormat } from 'prettier';
import type { RollupPlugin } from 'rollup';
import { minify as swcRollupMinify } from 'rollup-plugin-swc3';
import terser from '@rollup/plugin-terser';
import TerserPlugin from 'terser-webpack-plugin';

type CaseId =
  | 'heroicons-react'
  | 'headlessui-vue'
  | 'heroicons-vue'
  | 'lucide-react'
  | 'pinia'
  | 'react-query'
  | 'three'
  | 'vue-i18n'
  | 'vueuse-core'
  | 'vue';

type ToolId = 'rspack' | 'rollup' | 'rolldown';

type CliOptions = {
  caseId: CaseId;
};

type ModuleLike = {
  id?: unknown;
  name?: unknown;
  identifier?: unknown;
  moduleType?: unknown;
  chunks?: unknown;
  usedExports?: unknown;
  providedExports?: unknown;
};

type AnalysisModuleMapEntry = {
  id: string | number | null;
  analysisId: string;
  name: string;
  shortName: string;
  identifier?: string;
  moduleType?: string;
  chunks?: Array<string | number>;
  usedExports?: unknown;
  providedExports?: unknown;
  renderedLength?: number;
  originalLength?: number;
  removedExports?: unknown;
  renderedExports?: unknown;
};

type UsedExportsReportEntry = {
  id: string | number | null;
  analysisId: string;
  name: string;
  shortName: string;
  usedExports: unknown;
};

type UsedExportsReport = {
  caseId: CaseId;
  tool: ToolId;
  usedExportsSource: string;
  modules: UsedExportsReportEntry[];
};

type ModuleSizeReportEntry = {
  moduleName: string;
  bytes: number;
};

type ModuleSizeReport = {
  caseId: CaseId;
  tool: ToolId;
  sizeSource: string;
  modules: ModuleSizeReportEntry[];
};

type ModuleMarkerMeta = {
  comment: string;
  start: number;
  end: number;
  attributes: Record<string, string>;
  sourceBundleFile: string;
};

type RspackModuleProperty = {
  id: string;
  start: number;
  end: number;
  bodyStart?: number;
  bodyEnd?: number;
};

const caseEntries: Record<CaseId, string> = {
  'heroicons-react': `import {
  AcademicCapIcon as ReactAcademicCapIcon,
  AdjustmentsHorizontalIcon as ReactAdjustmentsHorizontalIcon,
  ArchiveBoxIcon as ReactArchiveBoxIcon,
} from '@heroicons/react/24/outline';
console.log({
  AcademicCapIcon: ReactAcademicCapIcon,
  AdjustmentsHorizontalIcon: ReactAdjustmentsHorizontalIcon,
  ArchiveBoxIcon: ReactArchiveBoxIcon,
});
`,
  'headlessui-vue': `import { Combobox as VueHeadlessCombobox, Dialog as VueHeadlessDialog, DialogPanel as VueHeadlessDialogPanel } from '@headlessui/vue';
console.log({ Combobox: VueHeadlessCombobox, Dialog: VueHeadlessDialog, DialogPanel: VueHeadlessDialogPanel });
`,
  'heroicons-vue': `import {
  AcademicCapIcon as VueAcademicCapIcon,
  AdjustmentsHorizontalIcon as VueAdjustmentsHorizontalIcon,
  ArchiveBoxIcon as VueArchiveBoxIcon,
} from '@heroicons/vue/24/outline';
console.log({
  AcademicCapIcon: VueAcademicCapIcon,
  AdjustmentsHorizontalIcon: VueAdjustmentsHorizontalIcon,
  ArchiveBoxIcon: VueArchiveBoxIcon,
});
`,
  'lucide-react': `import { Accessibility, Activity, ActivitySquare } from 'lucide-react';
console.log({ Accessibility, Activity, ActivitySquare });
`,
  pinia: `import { createPinia, defineStore, storeToRefs } from 'pinia';
console.log({ createPinia, defineStore, storeToRefs });
`,
  'react-query': `import {
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query';
console.log({ HydrationBoundary, QueryClient, useQuery });
`,
  three: `import { BoxGeometry, Color, Vector3 } from 'three';
console.log({ BoxGeometry, Color, Vector3 });
`,
  'vue-i18n': `import { createI18n, useI18n, vTDirective } from 'vue-i18n';
console.log({ createI18n, useI18n, vTDirective });
`,
  'vueuse-core': `import { createGlobalState, useDebounceFn, useThrottleFn } from '@vueuse/core';
console.log({ createGlobalState, useDebounceFn, useThrottleFn });
`,
  vue: `import { computed, reactive, watchEffect } from 'vue';
console.log({ computed, reactive, watchEffect });
`,
};

const readableDeadCodeMinifyOptions = {
  mangle: false,
  compress: {
    passes: 10,
  },
  format: {
    beautify: true,
    comments: 'all' as const,
  },
};

const analysisNodeEnv = 'production';

const analysisTools: ToolId[] = ['rspack', 'rollup', 'rolldown'];

const toolLabels: Record<ToolId, string> = {
  rspack: 'Rspack',
  rollup: 'Rollup',
  rolldown: 'Rolldown',
};

const usedExportsSourceByTool: Record<ToolId, string> = {
  rspack: 'Rspack stats.usedExports',
  rollup: 'Rollup renderedExports (Rollup has no native usedExports field)',
  rolldown:
    'Rolldown chunk.modules[moduleName].renderedExports (Rolldown has no native usedExports field)',
};

function setAnalysisNodeEnv(): void {
  process.env.NODE_ENV = analysisNodeEnv;
}

function assertCaseId(value: string): asserts value is CaseId {
  if (value in caseEntries) {
    return;
  }
  throw new Error(
    `Unsupported case: ${value}. Supported cases: ${Object.keys(caseEntries).join(', ')}`,
  );
}

function parseArgs(argv: string[]): CliOptions {
  let caseId: string | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--case') {
      caseId = argv[i + 1];
      i += 1;
      continue;
    }
  }

  if (!caseId) {
    throw new Error(
      'Usage: node ./scripts/analyze-popular-libs-case.ts --case <case-id>',
    );
  }

  assertCaseId(caseId);

  return { caseId };
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function getShortModuleName(repoRoot: string, value: string): string {
  if (path.isAbsolute(value)) {
    return toPosixPath(path.relative(repoRoot, value));
  }

  const normalized = value.replace(/^javascript\/[a-z/|]+\|/i, '');
  if (path.isAbsolute(normalized)) {
    return toPosixPath(path.relative(repoRoot, normalized));
  }

  return toPosixPath(normalized);
}

function escapeForBlockComment(value: string): string {
  return value.replace(/\*\//g, '*\\/');
}

function createStableAnalysisId(value: string): string {
  return createHash('sha1').update(value).digest('hex').slice(0, 8);
}

function formatModuleMarker(entry: AnalysisModuleMapEntry): string {
  const parts = [
    '@analysis-module',
    `id=${String(entry.id ?? entry.analysisId)}`,
    `analysisId=${entry.analysisId}`,
    `name=${entry.shortName}`,
  ];

  if (entry.identifier) {
    parts.push(`identifier=${entry.identifier}`);
  }

  return `/* ${escapeForBlockComment(parts.join(' '))} */`;
}

function collectRspackModuleMapEntries(
  repoRoot: string,
  modules: unknown[],
): AnalysisModuleMapEntry[] {
  return modules
    .filter((module): module is ModuleLike => {
      return Boolean(
        module &&
          typeof module === 'object' &&
          typeof module.name === 'string',
      );
    })
    .map((module) => {
      const name = String(module.name);
      const identifier =
        typeof module.identifier === 'string' ? module.identifier : undefined;
      const shortName = getShortModuleName(repoRoot, identifier ?? name);
      const rawId =
        typeof module.id === 'string' || typeof module.id === 'number'
          ? module.id
          : null;

      return {
        id: rawId,
        analysisId:
          rawId === null
            ? createStableAnalysisId(identifier ?? name)
            : String(rawId),
        name,
        shortName,
        identifier,
        moduleType:
          typeof module.moduleType === 'string' ? module.moduleType : undefined,
        chunks: Array.isArray(module.chunks)
          ? module.chunks.filter(
              (chunk): chunk is string | number =>
                typeof chunk === 'string' || typeof chunk === 'number',
            )
          : undefined,
        usedExports: module.usedExports,
        providedExports: module.providedExports,
      };
    });
}

async function writeModuleMap(
  outputDir: string,
  caseId: CaseId,
  tool: ToolId,
  modules: AnalysisModuleMapEntry[],
): Promise<void> {
  await writeFile(
    path.join(outputDir, 'module-map.json'),
    JSON.stringify(
      {
        caseId,
        tool,
        modules,
      },
      null,
      2,
    ),
    'utf8',
  );
}

async function writeUsedExportsReport(
  outputDir: string,
  caseId: CaseId,
  tool: ToolId,
  modules: UsedExportsReportEntry[],
): Promise<void> {
  const sortedModules = [...modules].sort((a, b) =>
    a.shortName.localeCompare(b.shortName),
  );

  await writeFile(
    path.join(outputDir, 'used-exports.json'),
    JSON.stringify(
      {
        caseId,
        tool,
        usedExportsSource: usedExportsSourceByTool[tool],
        modules: sortedModules,
      },
      null,
      2,
    ),
    'utf8',
  );
}

async function writeModuleSizeReport(
  outputDir: string,
  caseId: CaseId,
  tool: ToolId,
  sizeSource: string,
  sizeByModule: Map<string, number>,
): Promise<void> {
  const report: ModuleSizeReport = {
    caseId,
    tool,
    sizeSource,
    modules: [...sizeByModule.entries()]
      .sort((left, right) => left[0].localeCompare(right[0]))
      .map(([moduleName, bytes]) => ({
        moduleName,
        bytes,
      })),
  };

  await writeFile(
    path.join(outputDir, 'module-sizes.json'),
    JSON.stringify(report, null, 2),
    'utf8',
  );
}

async function readModuleSizeReportFile(
  outputDir: string,
): Promise<ModuleSizeReport | null> {
  try {
    return JSON.parse(
      await readFile(path.join(outputDir, 'module-sizes.json'), 'utf8'),
    ) as ModuleSizeReport;
  } catch {
    return null;
  }
}

async function readModuleSizeReport(outputDir: string): Promise<Map<string, number>> {
  const report = await readModuleSizeReportFile(outputDir);

  return new Map(
    (report?.modules ?? []).map((entry) => [entry.moduleName, entry.bytes] as const),
  );
}

function escapeMarkdownTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function formatUsedExportsValue(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '`[]`';
    }

    return [...value]
      .map((item) => String(item))
      .sort((a, b) => a.localeCompare(b))
      .map((item) => `\`${item}\``)
      .join('<br>');
  }

  if (value === null || typeof value === 'undefined') {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? '`true`' : '`false`';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return `\`${String(value)}\``;
  }

  return `\`${JSON.stringify(value)}\``;
}

function normalizeUsedExportsValue(value: unknown): string {
  if (Array.isArray(value)) {
    return JSON.stringify(
      [...value].map((item) => String(item)).sort((a, b) => a.localeCompare(b)),
    );
  }

  if (typeof value === 'undefined') {
    return '__undefined__';
  }

  return JSON.stringify(value);
}

function addSizeToMap(sizeByModule: Map<string, number>, moduleName: string, size: number) {
  sizeByModule.set(moduleName, (sizeByModule.get(moduleName) ?? 0) + size);
}

function formatBytes(value: number): string {
  return `\`${value.toLocaleString('en-US')} B\``;
}

function formatSignedBytes(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `\`${sign}${Math.abs(value).toLocaleString('en-US')} B\``;
}

function parseMarkerAttributes(comment: string): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (const match of comment.matchAll(/(\w+)=([^ ]+)/g)) {
    attributes[match[1]] = match[2];
  }

  return attributes;
}

function sanitizeFileNameSegment(value: string): string {
  const sanitized = value
    .replace(/^@/, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized || 'module';
}

function createShortReversedModuleFileName(
  repoRoot: string,
  tool: ToolId,
  attributes: Record<string, string>,
): string {
  const moduleName = attributes.name ?? attributes.identifier ?? attributes.analysisId;
  const shortName = getShortModuleName(repoRoot, moduleName);
  const normalizedShortName = toPosixPath(shortName);
  const moduleFileName = path.posix.basename(normalizedShortName);
  let packageName = '';

  const nodeModulesIndex = normalizedShortName.lastIndexOf('/node_modules/');
  if (nodeModulesIndex >= 0) {
    const packagePath = normalizedShortName.slice(
      nodeModulesIndex + '/node_modules/'.length,
    );
    const packageSegments = packagePath.split('/');
    packageName = packageSegments[0]?.startsWith('@')
      ? packageSegments.slice(0, 2).join('/')
      : packageSegments[0] ?? '';
  }

  const prefix = sanitizeFileNameSegment(
    tool === 'rspack'
      ? attributes.id ?? attributes.analysisId ?? 'module'
      : attributes.analysisId ?? attributes.id ?? 'module',
  );
  const shortParts = [
    packageName ? sanitizeFileNameSegment(packageName) : '',
    sanitizeFileNameSegment(moduleFileName),
  ].filter(Boolean);

  let fileName = `${prefix}-${shortParts.join('--') || 'module.js'}`;

  if (!fileName.endsWith('.js')) {
    fileName = `${fileName}.js`;
  }

  if (fileName.length <= 140) {
    return fileName;
  }

  const ext = path.posix.extname(fileName);
  const stem = fileName.slice(0, -ext.length);
  return `${stem.slice(0, 140 - ext.length)}${ext}`;
}

function ensureUniqueFileName(fileName: string, usedNames: Set<string>): string {
  if (!usedNames.has(fileName)) {
    usedNames.add(fileName);
    return fileName;
  }

  const ext = path.posix.extname(fileName);
  const stem = fileName.slice(0, -ext.length);
  let index = 2;

  while (usedNames.has(`${stem}--${index}${ext}`)) {
    index += 1;
  }

  const uniqueName = `${stem}--${index}${ext}`;
  usedNames.add(uniqueName);
  return uniqueName;
}

function toUnminifiedJsFilePath(filePath: string): string {
  if (!filePath.endsWith('.js')) {
    return filePath;
  }

  return `${filePath.slice(0, -3)}.unminified.js`;
}

function collectModuleMarkers(
  code: string,
  sourceBundleFile: string,
  kind: 'rspack' | 'rollup-start',
): ModuleMarkerMeta[] {
  const pattern =
    kind === 'rspack'
      ? /\/\* @analysis-module [^*]*\*\//g
      : /(?:\/\/ @analysis-module-start [^\n]+|\/\* @analysis-module-start [^*]*\*\/)/g;

  return [...code.matchAll(pattern)].map((match) => ({
    comment: match[0],
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
    attributes: parseMarkerAttributes(match[0]),
    sourceBundleFile,
  }));
}

function createUtf8ByteOffsetToStringIndexConverter(
  code: string,
): (byteOffset: number) => number {
  const byteLength = Buffer.byteLength(code, 'utf8');
  const byteToIndex = new Uint32Array(byteLength + 1);
  let byteCursor = 0;

  for (let index = 0; index < code.length; ) {
    const codePoint = code.codePointAt(index);
    if (typeof codePoint === 'undefined') {
      break;
    }

    const char = String.fromCodePoint(codePoint);
    const bytes = Buffer.byteLength(char, 'utf8');

    for (let i = 0; i < bytes; i += 1) {
      byteToIndex[byteCursor + i] = index;
    }

    byteCursor += bytes;
    index += char.length;
  }

  byteToIndex[byteLength] = code.length;

  return (byteOffset: number): number => {
    if (byteOffset <= 0) {
      return 0;
    }

    if (byteOffset >= byteToIndex.length) {
      return code.length;
    }

    return byteToIndex[byteOffset];
  };
}

function findRspackModuleProperties(
  node: unknown,
  byteOffsetToStringIndex: (byteOffset: number) => number,
): RspackModuleProperty[] {
  const properties: RspackModuleProperty[] = [];

  function visit(value: unknown): void {
    if (!value || typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }
      return;
    }

    const record = value as Record<string, unknown>;

    if (
      record.type === 'VariableDeclarator' &&
      record.id &&
      typeof record.id === 'object' &&
      (record.id as { type?: unknown; value?: unknown }).type === 'Identifier' &&
      (record.id as { value?: unknown }).value === '__webpack_modules__' &&
      record.init &&
      typeof record.init === 'object' &&
      (record.init as { type?: unknown; properties?: unknown }).type ===
        'ObjectExpression'
    ) {
      const objectExpression = record.init as {
        properties?: unknown[];
      };

      for (const property of objectExpression.properties ?? []) {
        if (!property || typeof property !== 'object') {
          continue;
        }

        const propertyRecord = property as Record<string, unknown>;
        const key = propertyRecord.key;
        const span = propertyRecord.span;
        const body =
          propertyRecord.body && typeof propertyRecord.body === 'object'
            ? (propertyRecord.body as Record<string, unknown>)
            : null;

        if (!key || typeof key !== 'object' || !span || typeof span !== 'object') {
          continue;
        }

        const keyRecord = key as Record<string, unknown>;
        const spanRecord = span as Record<string, unknown>;
        const startByte = Number(spanRecord.start);
        const endByte = Number(spanRecord.end);
        const rawId =
          keyRecord.type === 'NumericLiteral' || keyRecord.type === 'StringLiteral'
            ? keyRecord.value
            : keyRecord.type === 'Identifier'
              ? keyRecord.value
              : null;

        if (
          (propertyRecord.type === 'MethodProperty' ||
            propertyRecord.type === 'KeyValueProperty') &&
          (typeof rawId === 'number' || typeof rawId === 'string') &&
          Number.isFinite(startByte) &&
          Number.isFinite(endByte)
        ) {
          properties.push({
            id: String(rawId),
            start: byteOffsetToStringIndex(startByte - 1),
            end: byteOffsetToStringIndex(endByte),
            bodyStart:
              body && typeof body.span === 'object' && body.span
                ? byteOffsetToStringIndex(
                    Number((body.span as Record<string, unknown>).start) - 1,
                  )
                : undefined,
            bodyEnd:
              body && typeof body.span === 'object' && body.span
                ? byteOffsetToStringIndex(
                    Number((body.span as Record<string, unknown>).end),
                  )
                : undefined,
          });
        }
      }
    }

    for (const child of Object.values(record)) {
      visit(child);
    }
  }

  visit(node);

  return properties.sort((a, b) => a.start - b.start);
}

function findRspackMarkerForProperty(
  code: string,
  markers: ModuleMarkerMeta[],
  propertyStart: number,
  propertyId: string,
): ModuleMarkerMeta | undefined {
  for (let index = markers.length - 1; index >= 0; index -= 1) {
    const marker = markers[index];
    if (marker.end > propertyStart) {
      continue;
    }

    if (marker.attributes.id && marker.attributes.id !== propertyId) {
      continue;
    }

    const between = code.slice(marker.end, propertyStart).trim();
    if (between === '' || between === ',') {
      return marker;
    }
  }

  return undefined;
}

async function collectRspackModuleRenderedSizes(
  outputDir: string,
): Promise<Map<string, number>> {
  const sizeByModule = new Map<string, number>();
  const jsFiles = await glob('**/*.js', {
    absolute: true,
    cwd: outputDir,
    onlyFiles: true,
    ignore: ['reversed/**', '**/*.unminified.js'],
  });

  for (const file of jsFiles) {
    const code = await readFile(file, 'utf8');
    const ast = await swcParse(code, { syntax: 'ecmascript' });
    const byteOffsetToStringIndex = createUtf8ByteOffsetToStringIndexConverter(code);
    const properties = findRspackModuleProperties(ast, byteOffsetToStringIndex);
    const markers = collectModuleMarkers(code, file, 'rspack');

    for (const property of properties) {
      const marker = findRspackMarkerForProperty(
        code,
        markers,
        property.start,
        property.id,
      );

      if (!marker) {
        continue;
      }

      const moduleCode =
        property.bodyStart && property.bodyEnd
          ? code
              .slice(property.bodyStart, property.bodyEnd)
              .replace(/^\{\s*/, '')
              .replace(/\}\s*,?\s*$/, '')
              .trim()
          : code
              .slice(property.start, property.end)
              .replace(/,\s*$/, '')
              .trimStart();

      addSizeToMap(
        sizeByModule,
        marker.attributes.name ?? marker.attributes.analysisId ?? property.id,
        Buffer.byteLength(moduleCode, 'utf8'),
      );
    }
  }

  return sizeByModule;
}

async function writeReversedRspackModules(
  repoRoot: string,
  caseId: CaseId,
  outputDir: string,
): Promise<void> {
  const reversedDir = path.join(outputDir, 'reversed');
  await rm(reversedDir, { recursive: true, force: true });
  await mkdir(reversedDir, { recursive: true });

  const jsFiles = await glob('**/*.js', {
    absolute: true,
    cwd: outputDir,
    onlyFiles: true,
    ignore: ['reversed/**'],
  });
  const usedNames = new Set<string>();
  const sizeByModule = new Map<string, number>();

  for (const file of jsFiles) {
    const code = await readFile(file, 'utf8');
    const ast = await swcParse(code, { syntax: 'ecmascript' });
    const byteOffsetToStringIndex = createUtf8ByteOffsetToStringIndexConverter(code);
    const properties = findRspackModuleProperties(ast, byteOffsetToStringIndex);
    const markers = collectModuleMarkers(code, file, 'rspack');

    for (const property of properties) {
      const marker = findRspackMarkerForProperty(
        code,
        markers,
        property.start,
        property.id,
      );

      if (!marker) {
        continue;
      }

      const moduleCode =
        property.bodyStart && property.bodyEnd
          ? code
              .slice(property.bodyStart, property.bodyEnd)
              .replace(/^\{\s*/, '')
              .replace(/\}\s*,?\s*$/, '')
              .trim()
          : code
              .slice(property.start, property.end)
              .replace(/,\s*$/, '')
              .trimStart();
      const moduleName =
        marker.attributes.name ?? marker.attributes.analysisId ?? property.id;

      addSizeToMap(
        sizeByModule,
        moduleName,
        Buffer.byteLength(moduleCode, 'utf8'),
      );

      const formattedModuleCode =
        await prettifyRspackReversedModuleBody(moduleCode);
      const fileName = ensureUniqueFileName(
        createShortReversedModuleFileName(repoRoot, 'rspack', marker.attributes),
        usedNames,
      );

      await writeFile(
        path.join(reversedDir, fileName),
        `${marker.comment}\n${formattedModuleCode}\n`,
        'utf8',
      );
    }
  }

  await writeModuleSizeReport(
    outputDir,
    caseId,
    'rspack',
    'Rspack final minified bundle module bodies extracted during reversed-module generation',
    sizeByModule,
  );
}

async function collectRollupModuleRenderedSizes(
  outputDir: string,
): Promise<Map<string, number>> {
  const sizeByModule = new Map<string, number>();
  const report = await readModuleSizeReport(outputDir);
  for (const [moduleName, bytes] of report.entries()) {
    sizeByModule.set(moduleName, bytes);
  }

  return sizeByModule;
}

type RollupExtractedModule = {
  startComment: string;
  attributes: Record<string, string>;
  body: string;
};

async function collectRollupExtractedModules(
  outputDir: string,
): Promise<RollupExtractedModule[]> {
  const unminifiedFiles = await glob('**/*.unminified.js', {
    absolute: true,
    cwd: outputDir,
    dot: true,
    onlyFiles: true,
    ignore: ['reversed/**'],
  });
  const jsFiles =
    unminifiedFiles.length > 0
      ? unminifiedFiles
      : await glob('**/*.js', {
          absolute: true,
          cwd: outputDir,
          dot: true,
          onlyFiles: true,
          ignore: ['reversed/**'],
        });
  const extractedModules: RollupExtractedModule[] = [];

  for (const file of jsFiles) {
    const code = await readFile(file, 'utf8');
    const markers = collectModuleMarkers(code, file, 'rollup-start');
    if (markers.length === 0) {
      continue;
    }

    for (let index = 0; index < markers.length; index += 1) {
      const marker = markers[index];
      const nextMarker = markers[index + 1];
      const rawBody = code.slice(marker.end, nextMarker?.start ?? code.length).trim();
      const body = rawBody
        .replace(/\s*\/\/ @analysis-module-end [^\n]*$/g, '')
        .replace(/\s*\/\/#endregion @analysis-module-end [^\n]*$/g, '')
        .replace(/\s*\/\* @analysis-module-end [^*]*\*\/\s*$/g, '')
        .trim();

      if (body === '') {
        continue;
      }

      extractedModules.push({
        startComment:
          marker.comment.startsWith('//')
            ? `/* ${marker.comment.slice(2).trim()} */`
            : marker.comment,
        attributes: marker.attributes,
        body,
      });
    }
  }

  return extractedModules;
}

async function writeReversedRollupModules(
  repoRoot: string,
  outputDir: string,
): Promise<void> {
  const reversedDir = path.join(outputDir, 'reversed');
  await rm(reversedDir, { recursive: true, force: true });
  await mkdir(reversedDir, { recursive: true });

  const usedNames = new Set<string>();
  const modulesToWrite = await collectRollupExtractedModules(outputDir);

  for (const extractedModule of modulesToWrite) {
    const fileName = ensureUniqueFileName(
      createShortReversedModuleFileName(
        repoRoot,
        'rollup',
        extractedModule.attributes,
      ),
      usedNames,
    );

    await writeFile(
      path.join(reversedDir, fileName),
      `${extractedModule.startComment}\n${extractedModule.body}\n`,
      'utf8',
    );
  }
}

async function writeUsedExportsComparisonMarkdown(
  analysisRootDir: string,
  caseId: CaseId,
): Promise<void> {
  const toolReports = (
    await Promise.all(
      analysisTools.map(async (tool) => {
        const outputDir = path.join(analysisRootDir, tool);
        const reportPath = path.join(outputDir, 'used-exports.json');

        try {
          const report = JSON.parse(
            await readFile(reportPath, 'utf8'),
          ) as UsedExportsReport;
          const sizeReport = await readModuleSizeReportFile(outputDir);
          const sizeByModule = await readModuleSizeReport(outputDir);

          if (sizeByModule.size === 0) {
            if (tool === 'rspack') {
              for (const [moduleName, bytes] of (
                await collectRspackModuleRenderedSizes(outputDir)
              ).entries()) {
                sizeByModule.set(moduleName, bytes);
              }
            } else if (tool === 'rollup') {
              for (const [moduleName, bytes] of (
                await collectRollupModuleRenderedSizes(outputDir)
              ).entries()) {
                sizeByModule.set(moduleName, bytes);
              }
            }
          }

          return {
            tool,
            label: toolLabels[tool],
            outputDir,
            report,
            sizeReport,
            entries: new Map(
              report.modules.map((entry) => [entry.shortName, entry] as const),
            ),
            sizeByModule,
          };
        } catch {
          return null;
        }
      }),
    )
  ).filter(
    (
      report,
    ): report is {
      tool: ToolId;
      label: string;
      outputDir: string;
      report: UsedExportsReport;
      sizeReport: ModuleSizeReport | null;
      entries: Map<string, UsedExportsReportEntry>;
      sizeByModule: Map<string, number>;
    } => report !== null,
  );

  if (toolReports.length === 0) {
    throw new Error(`No analysis reports found under ${analysisRootDir}`);
  }

  const moduleNames = [
    ...new Set(
      toolReports.flatMap((toolReport) => [...toolReport.entries.keys()]),
    ),
  ].sort((a, b) => a.localeCompare(b));
  const bundledByAllCount = moduleNames.filter((moduleName) => {
    return toolReports.every((toolReport) => toolReport.entries.has(moduleName));
  }).length;
  const bundledOnlyByToolCounts = new Map<ToolId, number>(
    toolReports.map((toolReport) => [
      toolReport.tool,
      moduleNames.filter((moduleName) => {
        return (
          toolReport.entries.has(moduleName) &&
          toolReports.every((otherToolReport) => {
            return (
              otherToolReport.tool === toolReport.tool ||
              !otherToolReport.entries.has(moduleName)
            );
          })
        );
      }).length,
    ]),
  );

  const diffModuleNames = moduleNames.filter((moduleName) => {
    const presenceKey = toolReports
      .map((toolReport) => (toolReport.entries.has(moduleName) ? '1' : '0'))
      .join('');

    if (presenceKey !== '1'.repeat(toolReports.length)) {
      return true;
    }

    const usedExportsValues = toolReports.map((toolReport) =>
      normalizeUsedExportsValue(toolReport.entries.get(moduleName)?.usedExports),
    );
    const sizeValues = toolReports.map(
      (toolReport) => toolReport.sizeByModule.get(moduleName) ?? 0,
    );

    return (
      new Set(usedExportsValues).size > 1 || new Set(sizeValues).size > 1
    );
  });

  const identicalModuleCount = moduleNames.length - diffModuleNames.length;
  const usedExportsDiffCount = diffModuleNames.filter((moduleName) => {
    const presentUsedExportsValues = toolReports
      .filter((toolReport) => toolReport.entries.has(moduleName))
      .map((toolReport) =>
        normalizeUsedExportsValue(toolReport.entries.get(moduleName)?.usedExports),
      );

    return new Set(presentUsedExportsValues).size > 1;
  }).length;
  const sizeDiffCount = diffModuleNames.filter((moduleName) => {
    const sizeValues = toolReports.map(
      (toolReport) => toolReport.sizeByModule.get(moduleName) ?? 0,
    );

    return new Set(sizeValues).size > 1;
  }).length;

  diffModuleNames.sort((left, right) => {
    const leftSizeValues = toolReports.map(
      (toolReport) => toolReport.sizeByModule.get(left) ?? 0,
    );
    const rightSizeValues = toolReports.map(
      (toolReport) => toolReport.sizeByModule.get(right) ?? 0,
    );
    const leftDelta = Math.max(...leftSizeValues) - Math.min(...leftSizeValues);
    const rightDelta = Math.max(...rightSizeValues) - Math.min(...rightSizeValues);

    if (rightDelta !== leftDelta) {
      return rightDelta - leftDelta;
    }

    return left.localeCompare(right);
  });

  const headerCells = [
    'Module',
    ...toolReports.map((toolReport) => `In ${toolReport.label}`),
    ...toolReports.map((toolReport) => `${toolReport.label} bytes`),
    'Max delta',
    ...toolReports.map((toolReport) => `${toolReport.label} usedExports`),
  ];
  const dividerRow = `| ${headerCells.map(() => '---').join(' | ')} |`;
  const rows = diffModuleNames.map((moduleName) => {
    const sizeValues = toolReports.map(
      (toolReport) => toolReport.sizeByModule.get(moduleName) ?? 0,
    );
    const maxDelta = Math.max(...sizeValues) - Math.min(...sizeValues);

    return `| ${[
      escapeMarkdownTableCell(`\`${moduleName}\``),
      ...toolReports.map((toolReport) =>
        toolReport.entries.has(moduleName) ? 'yes' : '-',
      ),
      ...toolReports.map((toolReport) =>
        formatBytes(toolReport.sizeByModule.get(moduleName) ?? 0),
      ),
      formatBytes(maxDelta),
      ...toolReports.map((toolReport) =>
        escapeMarkdownTableCell(
          formatUsedExportsValue(toolReport.entries.get(moduleName)?.usedExports),
        ),
      ),
    ].join(' | ')} |`;
  });
  const emptyRow = `| ${[
    '_No differences_',
    ...headerCells.slice(1).map((headerCell) =>
      headerCell.includes('bytes') || headerCell === 'Max delta' ? '`0 B`' : '-',
    ),
  ].join(' | ')} |`;

  const markdown = [
    `# ${caseId} usedExports comparison`,
    '',
    `Generated from ${toolReports
      .flatMap((toolReport) => [
        `\`${toolReport.tool}/used-exports.json\``,
        `\`${toolReport.tool}/module-sizes.json\``,
      ])
      .join(', ')}.`,
    `Only modules with differences are shown in the table below.`,
    '',
    `- Case: \`${caseId}\``,
    `- Compared tools: ${toolReports
      .map((toolReport) => `\`${toolReport.tool}\``)
      .join(', ')}`,
    `- Total modules in comparison: \`${moduleNames.length}\``,
    `- Modules with differences: \`${diffModuleNames.length}\``,
    `- Modules identical across all tools: \`${identicalModuleCount}\``,
    `- Bundled by all tools: \`${bundledByAllCount}\``,
    ...toolReports.map(
      (toolReport) =>
        `- Bundled by ${toolReport.label}: \`${toolReport.entries.size}\``,
    ),
    ...toolReports.map(
      (toolReport) =>
        `- Only bundled by ${toolReport.label}: \`${bundledOnlyByToolCounts.get(toolReport.tool) ?? 0}\``,
    ),
    `- Modules with usedExports differences across tools: \`${usedExportsDiffCount}\``,
    `- Modules with rendered-size differences across tools: \`${sizeDiffCount}\``,
    ...toolReports.map(
      (toolReport) =>
        `- ${toolReport.label} size source: ${toolReport.sizeReport?.sizeSource ?? 'unavailable'}`,
    ),
    ...toolReports.map(
      (toolReport) =>
        `- ${toolReport.label} usedExports source: ${toolReport.report.usedExportsSource}`,
    ),
    '',
    `| ${headerCells.join(' | ')} |`,
    dividerRow,
    ...(rows.length > 0 ? rows : [emptyRow]),
    '',
  ].join('\n');

  await writeFile(
    path.join(analysisRootDir, 'used-exports-comparison.md'),
    markdown,
    'utf8',
  );
}

async function annotateRspackJsOutputs(
  outputDir: string,
  moduleEntries: AnalysisModuleMapEntry[],
): Promise<void> {
  const entryById = new Map<string, AnalysisModuleMapEntry>();
  for (const entry of moduleEntries) {
    if (entry.id === null) {
      continue;
    }
    entryById.set(String(entry.id), entry);
  }

  const jsFiles = await glob('**/*.js', {
    absolute: true,
    cwd: outputDir,
    onlyFiles: true,
  });

  for (const file of jsFiles) {
    const original = await readFile(file, 'utf8');
    const annotated = original.replace(
      /(^|\n\s*|[{,]\s*)(\d+)\(([^)]*)\)\s*\{/g,
      (match, prefix: string, moduleId: string, args: string) => {
        const entry = entryById.get(moduleId);
        if (!entry) {
          return match;
        }

        return `${prefix}${formatModuleMarker(entry)}\n${moduleId}(${args}) {`;
      },
    );

    if (annotated !== original) {
      await writeFile(file, annotated, 'utf8');
    }
  }
}

async function prettifyJsOutputs(outputDir: string): Promise<void> {
  const jsFiles = await glob('**/*.js', {
    absolute: true,
    cwd: outputDir,
    onlyFiles: true,
  });

  for (const file of jsFiles) {
    const original = await readFile(file, 'utf8');

    try {
      const formatted = await prettierFormat(original, {
        parser: 'babel',
      });

      if (formatted !== original) {
        await writeFile(file, formatted, 'utf8');
      }
    } catch {
      // Keep generated output untouched if Prettier can't parse it.
    }
  }
}

async function prettifyRspackReversedModuleBody(code: string): Promise<string> {
  try {
    const wrapped = `function __rspack_reversed_module__() {\n${code}\n}\n`;
    const formatted = await prettierFormat(wrapped, {
      parser: 'babel',
    });
    const lines = formatted.trimEnd().split('\n');

    if (
      lines.length >= 2 &&
      lines[0] === 'function __rspack_reversed_module__() {'
    ) {
      return lines
        .slice(1, -1)
        .map((line) => (line.startsWith('  ') ? line.slice(2) : line))
        .join('\n')
        .trim();
    }
  } catch {
    // Fall back to the extracted body if Prettier can't parse it.
  }

  return code;
}

async function writeSideBySideUnminifiedJs(
  sourceDir: string,
  targetDir: string,
): Promise<void> {
  const jsFiles = await glob('**/*.js', {
    absolute: true,
    cwd: sourceDir,
    onlyFiles: true,
  });

  for (const file of jsFiles) {
    const relativePath = path.relative(sourceDir, file);
    const targetFile = path.join(
      targetDir,
      toUnminifiedJsFilePath(relativePath),
    );
    const content = await readFile(file, 'utf8');
    await mkdir(path.dirname(targetFile), { recursive: true });
    await writeFile(targetFile, content, 'utf8');
  }
}

async function writeRollupOutputFiles(
  outputDir: string,
  output: Array<
    | { type: 'chunk'; fileName: string; code: string }
    | { type: 'asset'; fileName: string; source: string | Uint8Array }
  >,
): Promise<void> {
  for (const item of output) {
    const filePath = path.join(outputDir, item.fileName);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(
      filePath,
      item.type === 'chunk' ? item.code : item.source,
      'utf8',
    );
  }
}

function createRollupLikeAnalysisEntry(
  repoRoot: string,
  moduleName: string,
): AnalysisModuleMapEntry {
  const shortName = getShortModuleName(repoRoot, moduleName);

  return {
    id: null,
    analysisId: createStableAnalysisId(shortName),
    name: moduleName,
    shortName,
  };
}

function formatRollupLikeModuleStartMarker(entry: AnalysisModuleMapEntry): string {
  return `/* @analysis-module-start analysisId=${entry.analysisId} name=${escapeForBlockComment(entry.shortName)} */`;
}

function formatRollupTransformModuleStartMarker(entry: AnalysisModuleMapEntry): string {
  return `// @analysis-module-start analysisId=${entry.analysisId} name=${entry.shortName}`;
}

function formatRollupTransformModuleEndMarker(entry: AnalysisModuleMapEntry): string {
  return `// @analysis-module-end analysisId=${entry.analysisId} name=${entry.shortName}`;
}

function stripRolldownModuleCodeWrapper(code: string): string {
  return code
    .replace(/^\/\/#region[^\n]*\n?/, '')
    .replace(/\n?\/\/#endregion\s*$/, '')
    .trim();
}

function createRollupAnalysisPlugin(
  repoRoot: string,
): {
  plugin: RollupPlugin;
  getEntries(): AnalysisModuleMapEntry[];
} {
  const entries = new Map<string, AnalysisModuleMapEntry>();

  function getOrCreateEntry(id: string): AnalysisModuleMapEntry {
    const existing = entries.get(id);
    if (existing) {
      return existing;
    }

    const entry = createRollupLikeAnalysisEntry(repoRoot, id);
    entries.set(id, entry);
    return entry;
  }

  return {
    plugin: {
      name: 'analysis-module-markers',
      transform(code, id) {
        if (id.startsWith('\0')) {
          return null;
        }

        const entry = getOrCreateEntry(id);
        return {
          code: `${formatRollupTransformModuleStartMarker(entry)}\n${code}\n${formatRollupTransformModuleEndMarker(entry)}`,
          map: null,
        };
      },
    },
    getEntries() {
      return [...entries.values()];
    },
  };
}

async function collectOutputSize(outputDir: string): Promise<{
  outputBytes: number;
  gzipBytes: number;
}> {
  const files = await glob('**/*', {
    absolute: true,
    cwd: outputDir,
    dot: true,
    onlyFiles: true,
  });

  let outputBytes = 0;
  let gzipBytes = 0;

  for (const file of files) {
    if (file.endsWith('.map') || file.endsWith('.LICENSE.txt')) {
      continue;
    }

    const content = await readFile(file);
    outputBytes += content.byteLength;
    gzipBytes += gzipSizeSync(content);
  }

  return { outputBytes, gzipBytes };
}

async function writeEntryFile(entryPath: string, caseId: CaseId): Promise<void> {
  await mkdir(path.dirname(entryPath), { recursive: true });
  await writeFile(entryPath, caseEntries[caseId], 'utf8');
}

function createRollupAnalysisPlugins(
  basePlugins: RollupPlugin[],
  analysisPlugin: RollupPlugin,
  minify: boolean,
): RollupPlugin[] {
  const filteredBasePlugins = basePlugins.filter(
    (plugin) => plugin?.name !== 'swc-minify',
  );

  return [
    analysisPlugin,
    ...filteredBasePlugins,
    ...(minify
      ? [
          terser({
            ...readableDeadCodeMinifyOptions,
            module: true,
          }),
        ]
      : []),
  ];
}

type BundlerOutputItem =
  | { type: 'chunk'; fileName: string; code: string; modules?: Record<string, unknown> }
  | { type: 'asset'; fileName: string; source: string | Uint8Array };

type RolldownBuildResult = {
  output: BundlerOutputItem[];
  moduleMapEntries: AnalysisModuleMapEntry[];
  summaryModules: Array<Record<string, unknown>>;
  sizeByModule: Map<string, number>;
  moduleCodeByShortName: Map<string, string>;
};

function createRolldownAnalysisOutputOptions(
  baseOutput: Record<string, unknown>,
  minify: boolean,
): Record<string, unknown> {
  return {
    ...baseOutput,
    minify: minify ? 'dce-only' : false,
    comments: true,
    entryFileNames: 'assets/[name].js',
    chunkFileNames: 'chunks/[name].js',
    assetFileNames: 'assets/[name][extname]',
  };
}

async function buildRolldownAnalysis(
  repoRoot: string,
  entryPath: string,
  minify: boolean,
): Promise<RolldownBuildResult> {
  setAnalysisNodeEnv();
  const rolldownConfigModule = await import('../cases/popular-libs/rolldown.config.mjs');
  const rolldownConfig = rolldownConfigModule.default as Record<string, unknown>;
  const bundle = await rolldown({
    ...rolldownConfig,
    input: entryPath,
  });

  try {
    const result = await bundle.generate(
      createRolldownAnalysisOutputOptions(
        ((rolldownConfig.output as Record<string, unknown> | undefined) ?? {}),
        minify,
      ),
    );
    const output = (result.output ?? result) as BundlerOutputItem[];
    const moduleMapEntries = new Map<string, AnalysisModuleMapEntry>();
    const sizeByModule = new Map<string, number>();
    const moduleCodeByShortName = new Map<string, string>();

    for (const item of output) {
      if (item.type !== 'chunk' || !item.modules) {
        continue;
      }

      for (const [moduleName, info] of Object.entries(item.modules)) {
        const moduleInfo =
          info && typeof info === 'object' ? (info as Record<string, unknown>) : {};
        const moduleMapEntry =
          moduleMapEntries.get(moduleName) ??
          createRollupLikeAnalysisEntry(repoRoot, moduleName);
        const rawCode =
          typeof moduleInfo.code === 'string'
            ? stripRolldownModuleCodeWrapper(moduleInfo.code)
            : '';

        moduleMapEntry.renderedLength =
          typeof moduleInfo.renderedLength === 'number'
            ? moduleInfo.renderedLength
            : undefined;
        moduleMapEntry.originalLength =
          rawCode !== '' ? Buffer.byteLength(rawCode, 'utf8') : undefined;
        moduleMapEntry.renderedExports = moduleInfo.renderedExports;
        moduleMapEntry.usedExports = moduleInfo.renderedExports ?? [];
        moduleMapEntries.set(moduleName, moduleMapEntry);

        if (typeof moduleMapEntry.renderedLength === 'number') {
          sizeByModule.set(moduleMapEntry.shortName, moduleMapEntry.renderedLength);
        }

        if (rawCode !== '') {
          moduleCodeByShortName.set(moduleMapEntry.shortName, rawCode);
        }
      }
    }

    return {
      output,
      moduleMapEntries: [...moduleMapEntries.values()],
      summaryModules: [...moduleMapEntries.values()].map((entry) => ({
        name: entry.name,
        analysisId: entry.analysisId,
        usedExports: entry.usedExports ?? entry.renderedExports ?? [],
        renderedLength: entry.renderedLength,
        originalLength: entry.originalLength,
        renderedExports: entry.renderedExports,
      })),
      sizeByModule,
      moduleCodeByShortName,
    };
  } finally {
    await bundle.close();
  }
}

async function writeRolldownUnminifiedJsReference(
  repoRoot: string,
  entryPath: string,
  outputDir: string,
): Promise<RolldownBuildResult> {
  const tempOutputDir = path.join(outputDir, '.tmp-unminified');

  try {
    await rm(tempOutputDir, { recursive: true, force: true });
    await mkdir(tempOutputDir, { recursive: true });

    const buildResult = await buildRolldownAnalysis(repoRoot, entryPath, false);
    await writeRollupOutputFiles(tempOutputDir, buildResult.output);
    await prettifyJsOutputs(tempOutputDir);
    await writeSideBySideUnminifiedJs(tempOutputDir, outputDir);

    return buildResult;
  } finally {
    await rm(tempOutputDir, { recursive: true, force: true });
  }
}

async function writeReversedRolldownModules(
  repoRoot: string,
  outputDir: string,
  moduleMapEntries: AnalysisModuleMapEntry[],
  moduleCodeByShortName: Map<string, string>,
): Promise<void> {
  const reversedDir = path.join(outputDir, 'reversed');
  await rm(reversedDir, { recursive: true, force: true });
  await mkdir(reversedDir, { recursive: true });

  const usedNames = new Set<string>();

  for (const entry of moduleMapEntries) {
    const moduleCode = moduleCodeByShortName.get(entry.shortName);
    if (!moduleCode) {
      continue;
    }

    const fileName = ensureUniqueFileName(
      createShortReversedModuleFileName(repoRoot, 'rolldown', {
        analysisId: entry.analysisId,
        name: entry.shortName,
      }),
      usedNames,
    );

    await writeFile(
      path.join(reversedDir, fileName),
      `${formatRollupLikeModuleStartMarker(entry)}\n${moduleCode}\n`,
      'utf8',
    );
  }
}

function createRspackAnalysisConfig(
  rspackConfig: Record<string, unknown>,
  caseDir: string,
  entryPath: string,
  outputDir: string,
  minify: boolean,
): Record<string, unknown> {
  return {
    ...rspackConfig,
    mode: 'production' as const,
    context: caseDir,
    entry: entryPath,
    output: {
      ...((rspackConfig.output as Record<string, unknown> | undefined) ?? {}),
      path: outputDir,
      clean: true,
      filename: '[name].js',
      chunkFilename: 'chunks/[name].js',
      pathinfo: true,
    },
    optimization: {
      ...((rspackConfig.optimization as Record<string, unknown> | undefined) ?? {}),
      minimize: minify,
      concatenateModules: false,
      minimizer: minify
        ? [
            new TerserPlugin({
              terserOptions: {
                ...readableDeadCodeMinifyOptions,
                module: true,
              },
            }),
          ]
        : [],
    },
  };
}

async function runRspackBuild(
  rspackConfig: Record<string, unknown>,
  caseDir: string,
  entryPath: string,
  outputDir: string,
  minify: boolean,
): Promise<Record<string, unknown>> {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const finalConfig = createRspackAnalysisConfig(
    rspackConfig,
    caseDir,
    entryPath,
    outputDir,
    minify,
  );

  return new Promise<Record<string, unknown>>((resolve, reject) => {
    const compiler = rspack(finalConfig);
    compiler.run((error, stats) => {
      if (error) {
        reject(error);
        return;
      }
      if (!stats) {
        reject(new Error('Rspack finished without stats'));
        return;
      }

      try {
        const json = stats.toJson({
          all: false,
          modules: true,
          reasons: true,
          usedExports: true,
          providedExports: true,
          ids: true,
        }) as Record<string, unknown>;

        compiler.close((closeError) => {
          if (closeError) {
            reject(closeError);
            return;
          }
          resolve(json);
        });
      } catch (toJsonError) {
        reject(toJsonError);
      }
    });
  });
}

async function writeRspackUnminifiedJsReference(
  repoRoot: string,
  rspackConfig: Record<string, unknown>,
  caseDir: string,
  entryPath: string,
  outputDir: string,
): Promise<void> {
  const tempOutputDir = path.join(outputDir, '.tmp-unminified');

  try {
    const statsJson = await runRspackBuild(
      rspackConfig,
      caseDir,
      entryPath,
      tempOutputDir,
      false,
    );
    const modules = ((statsJson.modules as unknown[]) ?? []).filter((module) => {
      return Boolean(
        module &&
          typeof module === 'object' &&
          'name' in module &&
          typeof (module as { name?: unknown }).name === 'string',
      );
    });
    const moduleMapEntries = collectRspackModuleMapEntries(repoRoot, modules);

    await annotateRspackJsOutputs(tempOutputDir, moduleMapEntries);
    await prettifyJsOutputs(tempOutputDir);
    await writeSideBySideUnminifiedJs(tempOutputDir, outputDir);
  } finally {
    await rm(tempOutputDir, { recursive: true, force: true });
  }
}

async function writeRollupUnminifiedJsReference(
  repoRoot: string,
  entryPath: string,
  outputDir: string,
): Promise<void> {
  const tempOutputDir = path.join(outputDir, '.tmp-unminified');

  try {
    await rm(tempOutputDir, { recursive: true, force: true });
    await mkdir(tempOutputDir, { recursive: true });

    setAnalysisNodeEnv();
    const rollupConfigModule = await import('../cases/popular-libs/rollup.config.mjs');
    const rollupConfig = rollupConfigModule.default;
    const analysisPlugin = createRollupAnalysisPlugin(repoRoot);
    const bundle = await rollup({
      ...rollupConfig,
      input: entryPath,
      plugins: createRollupAnalysisPlugins(
        (rollupConfig.plugins ?? []) as RollupPlugin[],
        analysisPlugin.plugin,
        false,
      ),
      onwarn() {
        // Ignore warnings for this inspection script.
      },
    });

    try {
      const { output } = await bundle.generate({
        ...rollupConfig.output,
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]',
      });

      await writeRollupOutputFiles(
        tempOutputDir,
        output as Array<
          | { type: 'chunk'; fileName: string; code: string }
          | { type: 'asset'; fileName: string; source: string | Uint8Array }
        >,
      );
      await prettifyJsOutputs(tempOutputDir);
      await writeSideBySideUnminifiedJs(tempOutputDir, outputDir);
    } finally {
      await bundle.close();
    }
  } finally {
    await rm(tempOutputDir, { recursive: true, force: true });
  }
}

async function analyzeRspack(
  repoRoot: string,
  caseId: CaseId,
  entryPath: string,
  outputDir: string,
): Promise<void> {
  const caseDir = path.join(repoRoot, 'cases/popular-libs');

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const rspackConfigModule = await import('../cases/popular-libs/rspack.config.mjs');
  const rspackConfig = rspackConfigModule.default as Record<string, unknown>;
  const statsJson = await runRspackBuild(
    rspackConfig,
    caseDir,
    entryPath,
    outputDir,
    true,
  );

  const modules = ((statsJson.modules as unknown[]) ?? []).filter((module) => {
    return Boolean(
      module &&
        typeof module === 'object' &&
        'name' in module &&
        typeof (module as { name?: unknown }).name === 'string',
    );
  });
  const moduleMapEntries = collectRspackModuleMapEntries(repoRoot, modules);

  await annotateRspackJsOutputs(outputDir, moduleMapEntries);
  await prettifyJsOutputs(outputDir);
  const size = await collectOutputSize(outputDir);
  await writeModuleMap(outputDir, caseId, 'rspack', moduleMapEntries);
  await writeUsedExportsReport(
    outputDir,
    caseId,
    'rspack',
    moduleMapEntries.map((entry) => ({
      id: entry.id,
      analysisId: entry.analysisId,
      name: entry.name,
      shortName: entry.shortName,
      usedExports: entry.usedExports,
    })),
  );

  const summary = {
    caseId,
    tool: 'rspack',
    entryPath,
    outputDir,
    ...size,
    modules,
  };

  await writeFile(
    path.join(outputDir, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8',
  );

  await writeReversedRspackModules(repoRoot, caseId, outputDir);
  await writeRspackUnminifiedJsReference(
    repoRoot,
    rspackConfig,
    caseDir,
    entryPath,
    outputDir,
  );
}

async function analyzeRollup(
  repoRoot: string,
  caseId: CaseId,
  entryPath: string,
  outputDir: string,
): Promise<void> {
  const caseDir = path.join(repoRoot, 'cases/popular-libs');

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  setAnalysisNodeEnv();
  const rollupConfigModule = await import('../cases/popular-libs/rollup.config.mjs');
  const rollupConfig = rollupConfigModule.default;
  const analysisPlugin = createRollupAnalysisPlugin(repoRoot);

  const bundle = await rollup({
    ...rollupConfig,
    input: entryPath,
    plugins: createRollupAnalysisPlugins(
      (rollupConfig.plugins ?? []) as RollupPlugin[],
      analysisPlugin.plugin,
      true,
    ),
    onwarn() {
      // Ignore warnings for this inspection script.
    },
  });

  try {
    const { output } = await bundle.generate({
      ...rollupConfig.output,
      entryFileNames: 'assets/[name].js',
      chunkFileNames: 'chunks/[name].js',
      assetFileNames: 'assets/[name][extname]',
    });

    await writeRollupOutputFiles(
      outputDir,
      output as Array<
        | { type: 'chunk'; fileName: string; code: string }
        | { type: 'asset'; fileName: string; source: string | Uint8Array }
      >,
    );

    await prettifyJsOutputs(outputDir);

    const modules: Array<Record<string, unknown>> = [];
    const rollupModuleMapEntries = new Map<string, AnalysisModuleMapEntry>();

    for (const entry of analysisPlugin.getEntries()) {
      rollupModuleMapEntries.set(entry.name, entry);
    }

    for (const item of output) {
      if (item.type !== 'chunk') {
        continue;
      }

      for (const [moduleName, info] of Object.entries(item.modules)) {
        const moduleMapEntry =
          rollupModuleMapEntries.get(moduleName) ??
          ({
            id: null,
            analysisId: createStableAnalysisId(
              getShortModuleName(repoRoot, moduleName),
            ),
            name: moduleName,
            shortName: getShortModuleName(repoRoot, moduleName),
          } satisfies AnalysisModuleMapEntry);

        moduleMapEntry.renderedLength = info.renderedLength;
        moduleMapEntry.originalLength = info.originalLength;
        moduleMapEntry.removedExports = info.removedExports;
        moduleMapEntry.renderedExports = info.renderedExports;
        moduleMapEntry.usedExports = info.renderedExports;
        rollupModuleMapEntries.set(moduleName, moduleMapEntry);

        modules.push({
          name: moduleName,
          analysisId: moduleMapEntry.analysisId,
          usedExports: info.renderedExports,
          renderedLength: info.renderedLength,
          originalLength: info.originalLength,
          removedExports: info.removedExports,
          renderedExports: info.renderedExports,
        });
      }
    }

    const size = await collectOutputSize(outputDir);

    await writeModuleMap(outputDir, caseId, 'rollup', [
      ...rollupModuleMapEntries.values(),
    ]);
    await writeUsedExportsReport(
      outputDir,
      caseId,
      'rollup',
      [...rollupModuleMapEntries.values()].map((entry) => ({
        id: entry.id,
        analysisId: entry.analysisId,
        name: entry.name,
        shortName: entry.shortName,
        usedExports: entry.usedExports ?? entry.renderedExports ?? [],
      })),
    );
    await writeModuleSizeReport(
      outputDir,
      caseId,
      'rollup',
      'Rollup chunk.modules[moduleName].renderedLength',
      new Map(
        [...rollupModuleMapEntries.values()].map((entry) => [
          entry.shortName,
          typeof entry.renderedLength === 'number' ? entry.renderedLength : 0,
        ]),
      ),
    );

    const summary = {
      caseId,
      tool: 'rollup',
      entryPath,
      outputDir,
      ...size,
      modules,
    };

    await writeFile(
      path.join(outputDir, 'summary.json'),
      JSON.stringify(summary, null, 2),
      'utf8',
    );

    await writeRollupUnminifiedJsReference(repoRoot, entryPath, outputDir);
    await writeReversedRollupModules(repoRoot, outputDir);
  } finally {
    await bundle.close();
  }
}

async function analyzeRolldown(
  repoRoot: string,
  caseId: CaseId,
  entryPath: string,
  outputDir: string,
): Promise<void> {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const buildResult = await buildRolldownAnalysis(repoRoot, entryPath, true);
  await writeRollupOutputFiles(outputDir, buildResult.output);
  await prettifyJsOutputs(outputDir);

  const size = await collectOutputSize(outputDir);

  await writeModuleMap(outputDir, caseId, 'rolldown', buildResult.moduleMapEntries);
  await writeUsedExportsReport(
    outputDir,
    caseId,
    'rolldown',
    buildResult.moduleMapEntries.map((entry) => ({
      id: entry.id,
      analysisId: entry.analysisId,
      name: entry.name,
      shortName: entry.shortName,
      usedExports: entry.usedExports ?? entry.renderedExports ?? [],
    })),
  );
  await writeModuleSizeReport(
    outputDir,
    caseId,
    'rolldown',
    'Rolldown chunk.modules[moduleName].renderedLength',
    buildResult.sizeByModule,
  );

  const summary = {
    caseId,
    tool: 'rolldown',
    entryPath,
    outputDir,
    ...size,
    modules: buildResult.summaryModules,
  };

  await writeFile(
    path.join(outputDir, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8',
  );

  const unminifiedBuildResult = await writeRolldownUnminifiedJsReference(
    repoRoot,
    entryPath,
    outputDir,
  );
  await writeReversedRolldownModules(
    repoRoot,
    outputDir,
    unminifiedBuildResult.moduleMapEntries,
    unminifiedBuildResult.moduleCodeByShortName,
  );
}

const options = parseArgs(process.argv.slice(2));
const repoRoot = path.join(import.meta.dirname, '..');
const analysisRootDir = path.join(
  repoRoot,
  'cases/popular-libs/.analysis',
  `${options.caseId}-analysis`,
);
const entryPath = path.join(analysisRootDir, `${options.caseId}.js`);
const rspackOutputDir = path.join(analysisRootDir, 'rspack');
const rollupOutputDir = path.join(analysisRootDir, 'rollup');
const rolldownOutputDir = path.join(analysisRootDir, 'rolldown');

await rm(analysisRootDir, { recursive: true, force: true });
await mkdir(analysisRootDir, { recursive: true });
await writeEntryFile(entryPath, options.caseId);

console.log(`Running Rspack analysis for ${options.caseId}...`);
await analyzeRspack(repoRoot, options.caseId, entryPath, rspackOutputDir);

console.log(`Running Rollup analysis for ${options.caseId}...`);
await analyzeRollup(repoRoot, options.caseId, entryPath, rollupOutputDir);

console.log(`Running Rolldown analysis for ${options.caseId}...`);
await analyzeRolldown(repoRoot, options.caseId, entryPath, rolldownOutputDir);

await writeUsedExportsComparisonMarkdown(analysisRootDir, options.caseId);

console.log(
  `Analysis written to cases/popular-libs/.analysis/${options.caseId}-analysis`,
);
