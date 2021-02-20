import { ErrorInfo } from '@/types';

export const createError = (error: ErrorInfo, newError?: boolean): Error | ErrorInfo =>
  newError ? Error(JSON.stringify(error)) : error;
