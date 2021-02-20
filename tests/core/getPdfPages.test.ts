import fs from 'fs';
import Path from 'path';
import { getPdfPages } from '../../src/core';

describe('getPdfPages()', () => {
  const inputPath = Path.resolve(__dirname, '../mock/test.pdf');
  const buffer = fs.readFileSync(inputPath);

  it('should return array has all pages when offset is 0', async () => {
    expect.hasAssertions();
    const result = await getPdfPages(buffer, 0);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(14);
  });

  it('should return arrays of each page when offset is 1', async () => {
    expect.hasAssertions();
    const result = await getPdfPages(buffer, 1);
    expect(result).toHaveLength(14);
    expect(result[0]).toHaveLength(1);
  });

  it('should return arrays have same length with given offset', async () => {
    expect.hasAssertions();
    const result = await getPdfPages(buffer, 3);
    const expected = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [9, 10, 11],
      [12, 13],
    ];
    expect(result).toStrictEqual(expected);
  });
});
