import { APIResponse } from '@/types';

export const response = <TBody>(statusCode: number, body: TBody): APIResponse => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  return {
    headers,
    statusCode,
    body: JSON.stringify(body),
  };
};
