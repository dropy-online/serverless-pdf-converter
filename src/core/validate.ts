import { AvailableType, RequestErrors } from '@/types';
import { createError } from '@/utils';

export const validate = (inputType: string): void => {
  if (!inputType) {
    throw createError({ code: RequestErrors.UNDEFINED_FILE_TYPE });
  }
  if (!(inputType in AvailableType)) {
    throw createError({ code: RequestErrors.UNSUPPORTED_FILE_TYPE });
  }
};
