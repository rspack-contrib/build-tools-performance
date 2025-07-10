/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {MasterRequest} from '@romejs/core';
import {Diagnostics} from '@romejs/diagnostics';
import {SourceMap} from '@romejs/codec-source-map';
import {Consumer} from '@romejs/consume';
import {commandCategories, createMasterCommand} from '../../commands';
import TestRunner from '../testing/TestRunner';
import Bundler from '../bundler/Bundler';
import {AbsoluteFilePath} from '@romejs/path';
import {JS_EXTENSIONS} from '../../common/fileHandlers';
import {TestRunnerOptions} from '../testing/types';

type Flags = Omit<TestRunnerOptions, 'verboseDiagnostics'>;

export default createMasterCommand(
  {
    category: commandCategories.CODE_QUALITY,
    description: 'run tests',

    defineFlags(c: Consumer): Flags {
      return {
        coverage: c.get('coverage').asBoolean(true),
        showAllCoverage: c.get('showAllCoverage').asBoolean(false),
        updateSnapshots: c.get('updateSnapshots').asBoolean(false),
        freezeSnapshots: c.get('freezeSnapshots').asBoolean(false),
        syncTests: c.get('syncTests').asBoolean(false),
      };
    },

    async default(req: MasterRequest, commandFlags: Flags): Promise<void> {
      const {reporter} = req;

      const {paths} = await req.getFilesFromArgs(
        {
          test: (path) => path.hasExtension('test'),
          noun: 'test',
          verb: 'testing',
          configCategory: 'tests',
          advice: [
            {
              type: 'log',
              category: 'info',
              message: 'Searched for files with <emphasis>.test.*</emphasis> file extension',
            },
          ],
          extensions: JS_EXTENSIONS,
          disabledDiagnosticCategory: 'tests/disabled',
        },
      );

      if (paths.size === 0) {
        reporter.warn('No tests ran');
        return;
      }

      reporter.info(`Bundling test files`);

      let addDiagnostics: Diagnostics = [];

      const tests: Map<string, {
        code: string;
        sourceMap: SourceMap;
        path: AbsoluteFilePath;
      }> = new Map();

      const bundler = new Bundler(req, req.getBundlerConfigFromFlags({
        mocks: true,
      }));

      for (const [path, res] of await bundler.bundleMultiple(Array.from(paths))) {
        tests.set(path.join(), {
          code: res.entry.js.content,
          sourceMap: res.entry.sourceMap.map,
          path,
        });
      }

      reporter.info(`Running tests`);

      const runner = new TestRunner({
        addDiagnostics,
        options: {
          coverage: commandFlags.coverage,
          showAllCoverage: commandFlags.showAllCoverage,
          updateSnapshots: commandFlags.updateSnapshots,
          freezeSnapshots: commandFlags.freezeSnapshots,
          syncTests: commandFlags.syncTests,
          verboseDiagnostics: req.query.requestFlags.verboseDiagnostics,
        },
        sources: tests,
        request: req,
      });
      await runner.init();
    },
  },
);
