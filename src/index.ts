import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { response } from '@/utils';
import { validate } from '@/validate';
import { paralleConvert } from '@/parallel';
import { getPdf, separatePage } from '@/core';
import { RequestErrors } from '@/types';

export const endpoint: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return response(400, {
      status: 'error',
      error: RequestErrors.UNDIFINED_REQUEST_BODY,
    });
  }
  try {
    const { contentType, content, options } = JSON.parse(event.body);

    validate(contentType, options);

    const pdf = await getPdf(content);
    const pages = await separatePage(pdf);
    const urls = await paralleConvert(pages, options);

    return response(200, {
      status: 'succeded',
      body: urls,
    });
  } catch (error) {
    return response(400, {
      status: 'error',
      error,
    });
  }
};
