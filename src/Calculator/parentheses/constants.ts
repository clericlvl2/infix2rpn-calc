export const Parenthesis  = {
  Opening: '(',
  Closing: ')',
} as const;

export type TParenthesisObject = typeof Parenthesis;
export type TParentheses = TParenthesisObject[keyof TParenthesisObject];
export const PARENTHESES_PRECEDENCE = 0;
