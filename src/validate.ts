import { getExtension } from '@/utils';
import { AvailableType, RequestErrors } from '@/types';

export const validate = (path:string): void => {
  const fileType = getExtension(path);

  if (!fileType) {
    throw new Error(RequestErrors.UNDEFINED_FILE_TYPE);
  }
  if (!(fileType in AvailableType)) {
    throw new Error(RequestErrors.UNSUPPORTED_FILE_TYPE);
  }
};
