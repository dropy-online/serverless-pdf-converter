import { AvailableOutputType, Options } from '@/types';

export const defaultOptions: Options = {
  format: AvailableOutputType.png,
  size: 1000,
  quality: 100,
};

const config = JSON.parse(process.env.CONFIG);

const getFormat = (format?: string): string =>
  format in AvailableOutputType ? format : defaultOptions.format;

const getSize = (size?: number): number =>
  size < +config.maxSize && size > +config.minSize ? size : defaultOptions.size;

const getQuality = (quality?: number): number =>
  quality < +config.maxQuality && quality > +config.minQuality ? quality : defaultOptions.quality;

export const getOptions = (params: Partial<Options>): Options => ({
  format: getFormat(params.format),
  size: getSize(params.size),
  quality: getQuality(params.quality),
});
