import pdf from 'pdf-parse';
import { createError } from '@/utils';
import { ConvertErrors, PageDivision } from '@/types';

export const split = async (buffer: Buffer, offset: number): Promise<PageDivision> => {
  try {
    const { numpages: length } = await pdf(buffer);
    const divisor = offset === 0 ? length : offset;
    const pages = Array.from({ length }, (_, i) => i);
    return Array(Math.ceil(length / divisor))
      .fill(0)
      .map(() => pages.splice(0, divisor));
  } catch (e) {
    throw createError({ code: ConvertErrors.FAILED_PARSE_PDF, message: e });
  }
};
