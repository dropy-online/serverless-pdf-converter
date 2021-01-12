import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3Client } from '@/s3client';
import { validate } from '@/validate';
import { getOptions } from '@/options';
import { getPdfPages } from '@/core';
import { response, parallelRequest, getPrefix } from '@/utils';
import {
  RequestErrors,
  PageDivision,
  ConvertParams,
  ConvertResponse,
} from '@/types';

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.pathParameters.proxy) {
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
    const { ContentType, Body } = await s3.getObject(bucket, key);

    validate(ContentType);

    const options = getOptions(event.queryStringParameters || {});
    const pages = await getPdfPages(
      Body as Buffer,
      Number(process.env.PARALLEL_EXEC_OFFSET),
    );

    const urls = await parallelRequest<
      PageDivision,
      ConvertParams,
      ConvertResponse[]
    >(process.env.PARALLEL_FUNCTION_NAME, pages, { options, key });

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
