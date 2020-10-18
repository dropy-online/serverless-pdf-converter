export const getPrefix = (key: string): string | undefined => {
  const indexOfSep = key.lastIndexOf('/');
  return indexOfSep > 0 ? key.substring(0, indexOfSep) : undefined;
};
