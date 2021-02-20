export const getPrefix = (key: string, pathname: string | null): string | undefined => {
  const indexOfSep = key.lastIndexOf('/');
  const srcPath = indexOfSep > 0 && key.substring(0, indexOfSep);
  return `${srcPath ? srcPath + '/' : ''}${pathname ? pathname + '/' : ''}`;
};

export const createObjectKey = (prefix: string, page: number, format: string): string =>
  `${prefix}${page}.${format}`;
