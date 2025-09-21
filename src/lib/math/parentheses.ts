export const Parenthesis  = {
  Opening: '(',
  Closing: ')',
} as const;

export type TParenthesisObject = typeof Parenthesis;
export type TParentheses = TParenthesisObject[keyof TParenthesisObject];

export const isOpeningParenthesis = (str: unknown): str is TParenthesisObject['Opening'] => str === Parenthesis.Opening;
export const isClosingParenthesis = (str: unknown): str is TParenthesisObject['Closing'] => str === Parenthesis.Closing;
export const isParenthesis = (str: unknown): str is TParentheses => isOpeningParenthesis(str) || isClosingParenthesis(str);
