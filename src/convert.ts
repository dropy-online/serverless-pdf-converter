import 'source-map-support/register';
import { S3Client } from '@/s3client';
import { getPrefix, createError } from '@/utils';
import { ConvertHandler, ConvertErrors } from '@/types';
import { convertToImg } from './core/convertToImg';

export const handler: ConvertHandler = async (event, _, callback) => {
  const { item, params: { options, key } = {} } = event;

  if (!item || !options || !key) {
    callback(createError({ code: ConvertErrors.UNDEFINED_CONVERT_PAYLOAD }));
  }

  const s3 = new S3Client();
  const bucket = process.env.BUCKET;
  const prefix = getPrefix(key);

  try {
    const { Body } = await s3.getObject(bucket, key);
    const buffer = Buffer.from(Body);
    const images = await convertToImg(item, options, buffer);
    const result = await s3.uploadObjects(images, bucket, prefix, options.format);

    callback(null, { data: result });
  } catch (e) {
    callback(e);
  }
};
