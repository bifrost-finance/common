// Copyright 2017-2022 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { perfCmp } from '../test/performance';
import { hexToU8a as hexToU8aBuffer } from './toU8aBuffer';
import { hexToU8a } from '.';

let ptest = '0x';

for (let i = 0; i < 1_000_000; i++) {
  ptest += (i % 256).toString(16);
}

describe('hexToU8a', (): void => {
  it('returns an empty Uint8Array when null provided', (): void => {
    expect(
      hexToU8a(null)
    ).toHaveLength(0);
  });

  it('returns an empty Uint8Array when 0x provided', (): void => {
    expect(
      hexToU8a('0x')
    ).toHaveLength(0);
  });

  it('returns a Uint8Array with the correct values', (): void => {
    expect(
      hexToU8a('0x80000a')
    ).toEqual(
      new Uint8Array([128, 0, 10])
    );
  });

  it('returns a Uint8Array with the correct values (bitLength > provided)', (): void => {
    expect(
      hexToU8a('0x80000A', 64)
    ).toEqual(
      new Uint8Array([0, 0, 0, 0, 0, 128, 0, 10])
    );
  });

  it('returns a Uint8Array with the correct values (bitLength < provided)', (): void => {
    expect(
      hexToU8a('0x80000a', 16)
    ).toEqual(
      new Uint8Array([128, 0])
    );
  });

  it('converts known bytes to their correct values', (): void => {
    expect(
      hexToU8a('0x68656c6c6f20776f726c64') // hello world (11 bytes, non-aligned)
    ).toEqual(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64]));
  });

  it('fails when non-hex value provided', (): void => {
    expect(
      () => hexToU8a('notahex')
    ).toThrow(/hex value to convert/);
  });

  perfCmp('hexToU8a', ['hexToU8aBuffer', 'hexToU8a'], 25, [[ptest]], (s: string, isSecond) =>
    isSecond
      ? hexToU8a(s)
      : hexToU8aBuffer(s)
  );
});
