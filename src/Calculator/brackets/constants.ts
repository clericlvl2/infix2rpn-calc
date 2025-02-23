import type { ObjectValuesAsUnion } from '../../common/types';

export const Bracket = {
  Left: '(',
  Right: ')',
} as const;
export type TBracket = ObjectValuesAsUnion<typeof Bracket>;
export const BRACKET_PRIORITY = 0;
