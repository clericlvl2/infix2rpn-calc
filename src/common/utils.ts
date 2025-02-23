const WHITE_SPACES_REGEX = /[\s\u00A0]+/g;

export const filterWhitespaces = (str: string): string => {
  return str.replace(WHITE_SPACES_REGEX, '');
};

export const isExist = <T>(value: T | null | undefined): value is T => {
  return value !== undefined && value !== null;
};

export const isZero = (val: number | 0): val is 0 => {
  return isExist(val) && val === 0;
};

export const isEmptyString = (str: string | ''): str is '' => {
  return isExist(str) && str.length === 0;
};

export const isString = (value: unknown | string): value is string => typeof value === 'string';
