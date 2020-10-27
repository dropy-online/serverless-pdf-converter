import pdf from 'pdf-parse';
import { ConvertErrors } from '@/types';

export const getPdfPages = async (content:Buffer): Promise<number[]> => {
  try {
    const { numpages } = await pdf(content);
    const pages = Array(numpages).fill().map((_, i) => i + 1);
    return pages;
  } catch (e) {
    throw new Error(ConvertErrors.PDF_PARSING_FAIL);
  }
};
