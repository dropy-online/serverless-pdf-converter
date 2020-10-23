import 'source-map-support/register';
import { Handler } from 'aws-lambda';
import { ConvertErrors, ConvertEvent, ConvertResult } from '@/types';
import { convertToImg } from './core/convertToImg';

type ConvertHandler = Handler<ConvertEvent, ConvertResult> ;

export const convertHandler: ConvertHandler = async (event, context, callback) => {
  const { item, params } = event.payload;

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
