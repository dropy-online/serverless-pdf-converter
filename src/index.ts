import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { response } from '@/utils';
import { validate } from '@/validate';
import { RequestErrors } from '@/types';

export const endpoint: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return response(400, {
      status: 'error',
      error: RequestErrors.UNDIFINED_REQUEST_BODY,
    });
  }
  try {
    const { contentType } = JSON.parse(event.body);
    validate(contentType);
  } catch (error) {
    return response(400, {
      status: 'error',
      error,
    });
  }

  return response(200, {
    status: 'succeded',
  });
};
