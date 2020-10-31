import { AvailableType, RequestErrors } from '@/types';

export const validate = (inputType: string): void => {
  if (!inputType) {
    throw new Error(RequestErrors.UNDEFINED_FILE_TYPE);
  }
  if (!(inputType in AvailableType)) {
    throw new Error(RequestErrors.UNSUPPORTED_FILE_TYPE);
  }
};
