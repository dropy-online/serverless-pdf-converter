import 'source-map-support/register';
import { S3Client } from '@/s3client';
import { getPrefix } from '@/utils';
import { ConvertHandler, ConvertErrors } from '@/types';
import { convertToImg } from './core/convertToImg';

export const handler: ConvertHandler = async (event, _, callback) => {
  const { item, params: { options, key } = {} } = event;

  if (!item || !options || !key) {
    callback(ConvertErrors.UNDEFINED_PAYLOAD);
  }

  const s3 = new S3Client();
  const bucket = process.env.BUCKET;
  const prefix = getPrefix(key);

  try {
    const { Body } = await s3.getObject(bucket, key);
    const images = await convertToImg(item, options, Body as Buffer);
    const result = await s3.uploadObjects(images, bucket, prefix, options.type);

    callback(null, { data: result });
  } catch (e) {
    callback(e);
  }
};
