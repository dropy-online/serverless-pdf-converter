import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getType } from 'mime';
import { S3Client } from '@/s3client';
import { validate } from '@/validate';
import { getOptions } from '@/options';
import { getPdf, getPdfPages } from '@/core';
import { response, parallelRequest, getPrefix } from '@/utils';
import { RequestErrors, AvailableType } from '@/types';

export const requestHandler: APIGatewayProxyHandler = async (event) => {
  if (!event.pathParameters?.proxy) {
    return response(400, {
      status: 'error',
      error: RequestErrors.UNDIFINED_PATH_PARAM,
    });
  }
  const s3 = new S3Client();
  const bucket = process.env.BUCKET;
  const key = event.pathParameters.proxy as string;
  const prefix = getPrefix(key);

  try {
    const inputType = getType(key);
    validate(inputType);

    const content = await s3.getObject(bucket, key);
    const pdf = inputType === AvailableType.pdf ? content : await getPdf(inputType, content);
    const pages = await getPdfPages(pdf);
    const options = getOptions(event.queryStringParameters);
    const urls = await parallelRequest('convertLambda', pages, options);

    return response(200, {
      status: 'succeded',
      body: urls,
    });
  } catch (error) {
    await s3.emptyBucket(bucket, prefix);

    return response(400, {
      status: 'error',
      error,
    });
  }
};