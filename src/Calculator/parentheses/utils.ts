import { ErrorMessage, throwError } from '../../common/errors';
import { Parenthesis, type TParentheses, type TParenthesisObject } from './constants';

export const checkParentheses = (expression: string): void => {
  const counter: Record<string, number> = {};

  for (const chunk of expression) {
    const chunkCounter = counter[chunk] ?? 0;

    counter[chunk] = chunkCounter + 1;
  }

  if (counter[Parenthesis.Opening] !== counter[Parenthesis.Closing]) {
    throwError(ErrorMessage.UnmatchedParentheses);
  }
};

export const isOpeningParenthesis = (str: unknown): str is TParenthesisObject['Opening'] => str === Parenthesis.Opening;
export const isClosingParenthesis = (str: unknown): str is TParenthesisObject['Closing'] => str === Parenthesis.Closing;
export const isParenthesis = (str: unknown): str is TParentheses => isOpeningParenthesis(str) || isClosingParenthesis(str);
