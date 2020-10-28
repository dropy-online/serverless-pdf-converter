import pdf from 'pdf-parse';
import { ConvertErrors } from '@/types';

export const getPdfPages = async (buffer:Buffer, offset: number): Promise<number[]|number[][]> => {
  try {
    const { numpages: length } = await pdf(buffer);
    const pages = Array.from({ length }, (_, i) => i + 1);
    const requestPageArr = offset > 1
      ? Array(Math.ceil(length / offset)).fill().map(() => pages.splice(0, offset))
      : pages;

    return requestPageArr;
  } catch (e) {
    throw new Error(ConvertErrors.PDF_PARSING_FAIL);
  }
};
