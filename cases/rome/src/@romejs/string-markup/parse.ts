/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  ParserOptions,
  createParser,
  isAlpha,
  isEscaped,
  TokenValues,
  Position,
} from '@romejs/parser-core';
import {
  Tokens,
  TagAttributes,
  TagNode,
  ChildNode,
  Children,
  MarkupTagName,
} from './types';
import {inc, Number0, add, get0} from '@romejs/ob1';
import {descriptions} from '@romejs/diagnostics';
import {unescapeTextValue} from './escape';

const globalAttributes: Array<string> = ['emphasis', 'dim'];

const tags: Map<string, Array<string>> = new Map();
tags.set('pad', ['dir', 'char', 'count']);
tags.set('emphasis', []);
tags.set('number', ['approx', 'pluralSuffix', 'singularSuffix']);
tags.set('grammarNumber', ['plural', 'singular', 'none']);
tags.set('hyperlink', ['target']);
tags.set('filelink', ['target', 'column', 'line']);
tags.set('inverse', []);
tags.set('dim', []);
tags.set('filesize', []);
tags.set('duration', ['approx']);
tags.set('italic', []);
tags.set('underline', []);
tags.set('strike', []);
tags.set('black', []);
tags.set('brightBlack', []);
tags.set('red', []);
tags.set('brightRed', []);
tags.set('green', []);
tags.set('brightGreen', []);
tags.set('yellow', []);
tags.set('brightYellow', []);
tags.set('blue', []);
tags.set('brightBlue', []);
tags.set('magenta', []);
tags.set('brightMagenta', []);
tags.set('cyan', []);
tags.set('brightCyan', []);
tags.set('white', []);
tags.set('brightWhite', []);
tags.set('bgBlack', []);
tags.set('bgBrightBlack', []);
tags.set('bgRed', []);
tags.set('bgBrightRed', []);
tags.set('bgGreen', []);
tags.set('bgBrightGreen', []);
tags.set('bgYellow', []);
tags.set('bgBrightYellow', []);
tags.set('bgBlue', []);
tags.set('bgBrightBlue', []);
tags.set('bgMagenta', []);
tags.set('bgBrightMagenta', []);
tags.set('bgCyan', []);
tags.set('bgBrightCyan', []);
tags.set('bgWhite', []);
tags.set('bgBrightWhite', []);
tags.set('command', []);

//
function isStringValueChar(char: string, index: Number0, input: string): boolean {
  if (char === '"' && !isEscaped(index, input)) {
    return false;
  }

  return true;
}

function isTextChar(char: string, index: Number0, input: string): boolean {
  return !isTagStartChar(index, input);
}

export function isTagStartChar(index: Number0, input: string): boolean {
  const i = get0(index);
  return input[i] === '<' && !isEscaped(index, input);
}

type State = {inTagHead: boolean};

type StringMarkupParserOptions = ParserOptions;

const createStringMarkupParser = createParser(
  (ParserCore) => class StringMarkupParser extends ParserCore<Tokens, State> {
    constructor(opts: StringMarkupParserOptions) {
      super(opts, 'parse/stringMarkup', {inTagHead: false});
    }

    tokenizeWithState(
      index: Number0,
      input: string,
      state: State,
    ): undefined | {
      token: TokenValues<Tokens>;
      state: State;
    } {
      const escaped = isEscaped(index, input);
      const char = input[get0(index)];

      if (!escaped && state.inTagHead) {
        if (char === ' ') {
          return this.lookahead(inc(index));
        }

        if (char === '=') {
          return {
            state,
            token: this.finishToken('Equals'),
          };
        }

        if (char === '/') {
          return {
            state,
            token: this.finishToken('Slash'),
          };
        }

        if (isAlpha(char)) {
          const [value, end] = this.readInputFrom(index, isAlpha);
          return {
            state,
            token: this.finishValueToken('Word', value, end),
          };
        }

        if (char === '"') {
          const [value, stringValueEnd, unclosed] = this.readInputFrom(
            inc(index),
            isStringValueChar,
          );

          if (unclosed) {
            throw this.unexpected({
              description: descriptions.STRING_MARKUP.UNCLOSED_STRING,
              start: this.getPositionFromIndex(stringValueEnd),
            });
          }

          const end = add(stringValueEnd, 1);
          return {
            state,
            token: this.finishValueToken('String', value, end),
          };
        }

        if (char === '>') {
          return {
            state: {
              inTagHead: false,
            },
            token: this.finishToken('Greater'),
          };
        }
      }

      if (isTagStartChar(index, input)) {
        return {
          state: {
            inTagHead: true,
          },
          token: this.finishToken('Less'),
        };
      }

      // Keep eating text until we hit a <
      const [value, end] = this.readInputFrom(index, isTextChar);
      return {
        state,
        token: {
          type: 'Text',
          value: unescapeTextValue(value),
          start: index,
          end,
        },
      };
    }

    atTagEnd(): boolean {
      return this.matchToken('Less') && this.lookahead().token.type === 'Slash';
    }

    parseTag(headStart: Position): TagNode {
      const nameToken = this.expectToken('Word');
      const rawName = nameToken.value;

      const allowedAttributes = tags.get(rawName);
      if (allowedAttributes === undefined) {
        throw this.unexpected({
          description: descriptions.STRING_MARKUP.UNKNOWN_TAG_NAME(rawName),
          start: this.getPositionFromIndex(nameToken.start),
        });
      }

      // rome-suppress-next-line lint/noExplicitAny
      const tagName: MarkupTagName = (rawName as any);
      const attributes: TagAttributes = new Map();
      const children: Children = [];
      let selfClosing = false;

      // Parse attributes
      while (!this.matchToken('EOF') && !this.matchToken('Greater')) {
        const keyToken = this.getToken();

        let key;
        if (keyToken.type === 'Word') {
          key = keyToken.value;

          if (!allowedAttributes.includes(key) &&
              !globalAttributes.includes(key)) {
            throw this.unexpected(
                {
                  description: descriptions.STRING_MARKUP.INVALID_ATTRIBUTE_NAME_FOR_TAG(
                    tagName,
                    key,
                  ),
                },
              );
          }

          this.nextToken();

          // Shorthand properties
          if (this.matchToken('Word') || this.matchToken('Slash') ||
              this.matchToken('Greater')) {
            attributes.set(key, 'true');
            continue;
          }

          this.expectToken('Equals');

          const valueToken = this.expectToken('String');
          if (valueToken.type !== 'String') {
            throw new Error('Expected String');
          }
          const value = valueToken.value;

          attributes.set(key, value);
        } else if (keyToken.type === 'Slash') {
          this.nextToken();
          selfClosing = true;
        } else {
          throw this.unexpected({
            description: descriptions.STRING_MARKUP.EXPECTED_ATTRIBUTE_NAME,
          });
        }
      }

      this.expectToken('Greater');

      const headEnd = this.getPosition();

      // Verify closing tag
      if (!selfClosing) {
        while ( // Build children
        !this.matchToken('EOF') && !this.atTagEnd()) {
          children.push(this.parseChild());
        }

        if (this.matchToken('EOF')) {
          throw this.unexpected({
            description: descriptions.STRING_MARKUP.UNCLOSED_TAG(
              tagName,
              this.finishLocAt(headStart, headEnd),
            ),
          });
        } else {
          this.expectToken('Less');
          this.expectToken('Slash');

          const name = this.getToken();
          if (name.type === 'Word') {
            if (name.value !== tagName) {
              throw this.unexpected(
                  {
                    description: descriptions.STRING_MARKUP.INCORRECT_CLOSING_TAG_NAME(
                      tagName,
                      name.value,
                    ),
                  },
                );
            }

            this.nextToken();
          } else {
            throw this.unexpected({
              description: descriptions.STRING_MARKUP.EXPECTED_CLOSING_TAG_NAME,
            });
          }

          this.expectToken('Greater');
        }
      }

      return {
        type: 'Tag',
        attributes,
        name: tagName,
        children,
      };
    }

    parseChild(): ChildNode {
      const start = this.getPosition();
      const token = this.getToken();
      this.nextToken();

      if (token.type === 'Text') {
        return {
          type: 'Text',
          value: token.value,
        };
      } else if (token.type === 'Less') {
        return this.parseTag(start);
      } else {
        throw this.unexpected({
          description: descriptions.STRING_MARKUP.UNKNOWN_START,
        });
      }
    }

    parse(): Children {
      const children: Children = [];
      while (!this.matchToken('EOF')) {
        children.push(this.parseChild());
      }
      return children;
    }
  },
);

export function parseMarkup(input: string) {
  try {
    return createStringMarkupParser({input}).parse();
  } catch (err) {
    throw err;
  }
}
