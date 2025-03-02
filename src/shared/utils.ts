const WHITE_SPACES_REGEX = /[\s\u00A0]+/g;

export const filterWhitespaces = (str: string): string => {
  return str.replace(WHITE_SPACES_REGEX, '');
};

export const regexEscape = (string: string) => {
  return string.replace(/[-\]\[.*+?^${}()|/]/g, '\\$&');
};
