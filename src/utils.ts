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

export const getExtension = (path: string): string | false => {
  const indexOfPoint = path.lastIndexOf('.');
  return indexOfPoint > 0 && path.substring(indexOfPoint + 1);
};

export const getFilename = (path: string): string => {
  const indexOfSep = path.lastIndexOf('/');
  let indexOfPoint: number | undefined = path.lastIndexOf('.');

  indexOfPoint = indexOfPoint > 0 ? indexOfPoint : undefined;

  return path.substring(indexOfSep + 1, indexOfPoint);
};
