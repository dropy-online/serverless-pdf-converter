import 'source-map-support/register';
import { S3Client, Converter } from '@/core';
import { getPrefix, createError } from '@/utils';
import { ConvertHandler, ConvertErrors } from '@/types';

export const handler: ConvertHandler = async (event, _, callback) => {
  const { item, params: { options, key } = {} } = event;

  if (!item || !options || !key) {
    callback(createError({ code: ConvertErrors.UNDEFINED_CONVERT_PAYLOAD }, true) as Error);
  }

  const s3 = new S3Client(process.env.BUCKET);
  const prefix = getPrefix(key, options.pathname);

  try {
    const { Body } = await s3.getObject(key);
    const buffer = Buffer.from(Body as string);

    const converter = new Converter(buffer, options);
    const convertArr = item.map(async (page) => {
      const image = await converter.convert(page);
      const result = await s3.uploadObject(image, page, prefix, options.format);
      return result;
    });

    const data = await Promise.all(convertArr);
    callback(null, { data });
  } catch (e) {
    callback(createError(e, true) as Error);
  }
};
