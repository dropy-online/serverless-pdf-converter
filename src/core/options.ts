import { Options } from '@/types';

const defaultOptions: Options = JSON.parse(process.env.DEFAULT_OPTIONS);

const getFormat = (format?: Options['format']) => format || defaultOptions.format;

const getSize = (size?: Options['size']) => size || defaultOptions.size;

const getQuality = (quality?: Options['quality']) => quality || defaultOptions.quality;

const getDensity = (density?: Options['density']) => density || defaultOptions.density;

const getDivision = (division?: Options['division']) => division || defaultOptions.division;

export const getOptions = (params: Partial<Options>): Options => ({
  format: getFormat(params.format),
  size: getSize(params.size),
  quality: getQuality(params.quality),
  density: getDensity(params.density),
  division: getDivision(params.division),
});
