import { S3 } from 'aws-sdk';
import fs from 'fs';
import gm from 'gm';
import { promisify } from 'util';

export const getPdfPages = async (content:S3.Body|fs.ReadStream): Promise<number[]> => {
  const pdf: gm.State = gm(content);
  const identify = promisify<string, string>(pdf.identify.bind(pdf));
  const pageStr: string = await identify('%p ');
  const pageStrArr: string[] = pageStr.split(/\s+/);
  const pages: number[] = pageStrArr.map((str) => +str)
    .filter((page) => !Number.isNaN(page));

  return pages;
};
