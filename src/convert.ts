import 'source-map-support/register';
import { ConvertHandler, ConvertErrors } from '@/types';
import { convertToImg } from './core/convertToImg';

export const handler: ConvertHandler = async (event, context, callback) => {
  const { item, params } = event;

  if (!item) {
    callback(ConvertErrors.UNDEFINED_PAYLOAD);
  }

  try {
    const result = await convertToImg(item, params);
    callback(null, result);
  } catch (e) {
    callback(e);
  }
};
