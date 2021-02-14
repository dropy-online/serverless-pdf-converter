import { ErrorInfo } from '@/types';

export const createError = (error: ErrorInfo): Error => new Error(JSON.stringify(error));
