import { AvailableOutputType } from '@/types';

export interface Options {
  outputPath: string;
  outputName?:string;
  type?: string;
  size?:number;
  quality?:number;
}

export const defaultOptions: Options = {
  outputPath: '',
  outputName: '',
  type: AvailableOutputType.png,
  size: 1204,
  quality: 100,
};
