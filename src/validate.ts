import { getExtension } from '@/utils';
import { Options } from '@/options';
import { AvailableType, AvailableOutputType, RequestErrors } from '@/types';

export const validate = (path:string, options: Options): void => {
  const fileType = getExtension(path);

  if (!fileType) {
    throw new Error(RequestErrors.UNDEFINED_FILE_TYPE);
  }
  if (!(fileType in AvailableType)) {
    throw new Error(RequestErrors.UNSUPPORTED_FILE_TYPE);
  }
  if (!options.outputPath) {
    throw new Error(RequestErrors.UNDEFINED_OUTPUT_PATH);
  }
  if (!(options.type in AvailableOutputType)) {
    throw new Error(RequestErrors.UNSUPPORT_OUTPUT_TYPE);
  }
};
