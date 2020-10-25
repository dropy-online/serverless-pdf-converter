import 'source-map-support/register';
import { Handler } from 'aws-lambda';
import { ConvertErrors, ConvertEvent, ConvertResult } from '@/types';
import { S3Client } from '@/s3client';
import { convertToImg } from './core/convertToImg';

type ConvertHandler = Handler<ConvertEvent, ConvertResult> ;

export const handler: ConvertHandler = async (event, context, callback) => {
  const { item, params } = event;

  if (!item) {
    callback(ConvertErrors.UNDEFINED_PAYLOAD);
  }

  const s3 = new S3Client();
  const bucket = process.env.BUCKET;

  try {
    const result = await convertToImg(item, params);
    const url = await s3.putObject(bucket, params.prefix);

    callback(null, url);
  } catch (e) {
    callback(e);
  }
};
