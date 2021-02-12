import { Options, PageObject } from '@/types';
import gm from 'gm';

export const convertToImg = async (
  pages: number[],
  options: Options,
  buffer: Buffer
): Promise<PageObject[]> => {
  const { size, quality, format } = options;
  const result = pages.map(
    (page) =>
      new Promise<PageObject>((resolve, reject) =>
        gm(buffer)
          .selectFrame(page)
          .resize(size)
          .quality(quality)
          .toBuffer(format, (error, imgBuffer) =>
            error ? reject(error) : resolve({ page, body: imgBuffer })
          )
      )
  );
  const bufferArr = await Promise.all(result);
  return bufferArr;
};
