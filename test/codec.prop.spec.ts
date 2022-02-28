import { ascii, assert, property, unicode } from 'fast-check';

import { decodeValue, encodeName, encodeValue } from '../src/codec';

// eslint-disable-next-line unicorn/prefer-code-point
const excludeAscii: (value: string) => boolean = value => value.charCodeAt(0) > 127;

test('name decode/encode round trip', () => {
  assert(
    property(unicode(), value => expect(decodeValue(encodeValue(value))).toBe(value)),
    { numRuns: 1000, verbose: true },
  );
});

test('value encoding', () => {
  // ascii minus forbidden characters - no need to encode
  assert(
    property(
      ascii().filter(
        value => !/\p{Control}/u.test(value) && ![' ', '"', ',', ';', '\\', '%'].includes(value),
      ),
      value => expect(encodeValue(value)).toHaveLength(1),
    ),
    { numRuns: 1000, verbose: true },
  );

  // unicode - will need to be encode
  assert(
    property(unicode().filter(excludeAscii), value =>
      expect(encodeValue(value).length).toBeGreaterThan(1),
    ),
    { numRuns: 1000, verbose: true },
  );
});

test('name encoding', () => {
  // ascii minus forbidden characters - no need to encode
  assert(
    property(
      ascii().filter(
        value =>
          !/\p{Control}/u.test(value) &&
          ![
            '(',
            ')',
            '<',
            '>',
            '@',
            ',',
            ';',
            ':',
            '\\',
            '"',
            '/',
            '[',
            ']',
            '?',
            '=',
            '{',
            '}',
            ' ',
            '\t',
            '%',
          ].includes(value),
      ),
      value => expect(encodeName(value)).toHaveLength(1),
    ),
    { numRuns: 1000, verbose: true },
  );

  // unicode - will need to be encode
  assert(
    property(unicode().filter(excludeAscii), value =>
      expect(encodeName(value).length).toBeGreaterThan(1),
    ),
    { numRuns: 1000, verbose: true },
  );
});
