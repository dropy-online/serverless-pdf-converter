import fs from 'fs';
import Path from 'path';
import { getPdfPages } from '../../src/core';

describe('getPdfPages()', () => {
  const inputPath = Path.resolve(__dirname, '../mock/test.pdf');
  const buffer = fs.readFileSync(inputPath);

  it('should return page number array', async () => {
    expect.hasAssertions();
    const result = await getPdfPages(buffer);
    expect(result).toHaveLength(14);
  });

  it('should return two dimensional array when offset is given', async () => {
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
