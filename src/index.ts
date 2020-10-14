import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { response } from '@/utils';
import { RequestErrors } from '@/types';

export const endpoint: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return response(400, {
      status: 'error',
      error: RequestErrors.UNDIFINED_REQUEST_BODY,
    });
  }
  return response(200, {
    status: 'succeded',
  });
};
