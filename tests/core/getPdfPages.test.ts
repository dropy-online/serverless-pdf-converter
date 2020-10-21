import { getPdfPages } from '@/core';
import fs from 'fs';
import Path from 'path';

describe('getPdfPages()', () => {
  const inputPath = Path.resolve(__dirname, '../mock/test.pdf');
  it('should return page number array', async () => {
    expect.hasAssertions();
    const readStream: fs.ReadStream = fs.createReadStream(inputPath);
    const result = await getPdfPages(readStream);
    expect(result).toHaveLength(14);
  });
});
