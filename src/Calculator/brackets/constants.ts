export const Bracket = {
  Left: '(',
  Right: ')',
} as const;

export type TBracketObject = typeof Bracket;
export type TBracket = TBracketObject[keyof TBracketObject];
export const BRACKET_PRIORITY = 0;
