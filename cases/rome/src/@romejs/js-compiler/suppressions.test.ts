/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {test} from 'rome';
import {extractSuppressionsFromComments} from './suppressions';
import {CommentBlock} from '@romejs/js-ast';
import {number0, coerce1} from '@romejs/ob1';

function generateComment(value: string, line: number): CommentBlock {
  const pos = {
    index: number0,
    column: number0,
    line: coerce1(line),
  };

  return {
    type: 'CommentBlock',
    value,
    loc: {
      filename: 'unknown',
      start: pos,
      end: pos,
    },
  };
}

test('single category', (t) => {
  t.snapshot(extractSuppressionsFromComments([
    generateComment('rome-suppress foo', 1),
    generateComment('* rome-suppress foo', 2),
    generateComment(' * rome-suppress foo', 3),
    generateComment('* wow\n * rome-suppress foo', 4),
  ]));
});

test('multiple categories', (t) => {
  t.snapshot(extractSuppressionsFromComments([
    generateComment('rome-suppress foo bar', 1),
    generateComment('* rome-suppress foo bar', 2),
    generateComment(' * rome-suppress foo bar', 3),
    generateComment(
      '* wow\n * rome-suppress foo bar\n* rome-suppress cat dog',
      4,
    ),
  ]));
});

test('typos', (t) => {
  t.snapshot(extractSuppressionsFromComments([
    generateComment('rome-ignore foo bar', 1),
  ]));
});

test('duplicates', (t) => {
  t.snapshot(extractSuppressionsFromComments([
    generateComment('rome-suppress foo foo', 1),
  ]));
});
