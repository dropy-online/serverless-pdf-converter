import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const endpoint: APIGatewayProxyHandler | any = async (event, _context) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'Succeeded',
    input: event,
  }, null, 2),
});
