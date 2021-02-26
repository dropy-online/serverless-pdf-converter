import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3Client, validate, split, getOptions } from '@/core';
import { response, parallelRequest, getPrefix } from '@/utils';
import {
  RequestErrors,
  ErrorResponseBody,
  SuccessResponseBody,
  PageDivision,
  ConvertParams,
  ConvertResponse,
  ConvertResult,
} from '@/types';

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.queryStringParameters?.key) {
    return response<ErrorResponseBody>(500, {
      status: 'error',
      error: {
        code: RequestErrors.UNDEFINED_QUERY_PARAMS,
      },
    });
  }
  const s3 = new S3Client(process.env.BUCKET);
  const { key: encodedKey } = event.queryStringParameters;
  const key = decodeURIComponent(encodedKey);
  const options = getOptions(event.queryStringParameters || {});
  const prefix = getPrefix(key, options.pathname);

  try {
    const { ContentType, Body } = await s3.getObject(key);

    validate(ContentType);

    const pageDivision = await split(Body as Buffer, options.division);

    const result = await parallelRequest<PageDivision, ConvertParams, ConvertResponse>(
      process.env.CONVERT_FUNCTION_NAME,
      pageDivision,
      { options, key }
    );
    const data = result.reduce((acc: ConvertResult[], res) => acc.concat(res.data), []);

    return response<SuccessResponseBody>(200, {
      status: 'succeded',
      data,
    });
  } catch (e) {
    await s3.emptyBucket(prefix);

    const error = typeof e === 'string' ? JSON.parse(e) : e;
    const statusCode: number = error?.message?.statusCode || 500;

    return response<ErrorResponseBody>(statusCode, {
      status: 'error',
      error,
    });
  }
};
