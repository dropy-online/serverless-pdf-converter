import { AvailableOutputType, Options } from '@/types';

export const defaultOptions: Options = {
  type: AvailableOutputType.png,
  size: 100,
  quality: 100,
};

const config = JSON.parse(process.env.CONFIG);

const getType = (type?: string): string =>
  (type in AvailableOutputType ? type : defaultOptions.type);

const getSize = (size?: number): number =>
  (size < +config.maxSize && size > +config.minSize ? size : defaultOptions.size);

const getQuality = (quality?: number): number =>
  (quality < +config.maxQuality && quality > +config.minQuality
    ? quality
    : defaultOptions.quality);

export const getOptions = (params): Options => ({
  type: getType(params.type),
  size: getSize(params.size),
  quality: getQuality(params.quality),
});
