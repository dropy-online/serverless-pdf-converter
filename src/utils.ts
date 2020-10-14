import { APIResponse } from '@/types';

export const response = (statusCode: number, body: any): APIResponse => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  return {
    headers,
    statusCode,
    body: JSON.stringify(body),
  };
};
