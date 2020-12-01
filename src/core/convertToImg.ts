import { Options, ConvertResult } from '@/types';
import gm from 'gm';

export const convertToImg = async (
  page: number[],
  options: Options,
  buffer: Buffer,
) : Promise<ConvertResult[]> => {
  const { size, quality, type } = options;
  const result = page.map((num) => new Promise<ConvertResult>((resolve, reject) =>
    gm(buffer)
      .selectFrame(num)
      .resize(size)
      .quality(quality)
      .toBuffer(type, (error, imgBuffer) =>
        (error ? reject(error) : resolve({ page: num, body: imgBuffer })))));

  const bufferArr = await Promise.all(result);
  return bufferArr;
};