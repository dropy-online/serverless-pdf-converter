import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3Client, validate, getPdfPages, getOptions } from '@/core';
import { response, parallelRequest, getPrefix } from '@/utils';
import {
  RequestErrors,
  ErrorBody,
  SuccessBody,
  PageDivision,
  ConvertParams,
  ConvertResponse,
  ConvertResult,
} from '@/types';

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.queryStringParameters?.key) {
    return response<ErrorBody>(500, {
      status: 'error',
      error: {
        code: RequestErrors.UNDEFINED_QUERY_PARAMS,
      },
    });
  }
  const s3 = new S3Client();
  const bucket = process.env.BUCKET;
  const { key } = event.queryStringParameters;
  const prefix = getPrefix(key);

  try {
    const { ContentType, Body } = await s3.getObject(bucket, key);

    validate(ContentType);

    const options = getOptions(event.queryStringParameters || {});
    const pageDivision = await getPdfPages(Body as Buffer, options.division);
    const result = await parallelRequest<PageDivision, ConvertParams, ConvertResponse>(
      process.env.CONVERT_FUNCTION_NAME,
      pageDivision,
      { options, key }
    );
    const data = result.reduce((acc: ConvertResult[], res) => acc.concat(res.data), []);

    return response<SuccessBody>(200, {
      status: 'succeded',
      data,
    });
  } catch (e) {
    await s3.emptyBucket(bucket, prefix);

    const error = typeof e === 'string' ? JSON.parse(e) : e;
    const statusCode: number = error?.message?.statusCode || 500;

    return response<ErrorBody>(statusCode, {
      status: 'error',
      error,
    });
  }
};
