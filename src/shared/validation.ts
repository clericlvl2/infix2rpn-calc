const DECIMAL_NUMBER_REGEX = /^-?\d+(?:\.\d+)?$/;

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

export const isStrictStringifiedNumber = (value: unknown): value is string => {
  return isString(value) && DECIMAL_NUMBER_REGEX.test(value);
};
