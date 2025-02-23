import { ErrorMessage, throwError } from '../../common/errors';
import { Bracket, type TBracket, type TBracketObject } from './constants';

export const checkBrackets = (expression: string): void => {
  const counter: Record<string, number> = {};

  for (const chunk of expression) {
    const chunkCounter = counter[chunk] ?? 0;

    counter[chunk] = chunkCounter + 1;
  }

  if (counter[Bracket.Left] !== counter[Bracket.Right]) {
    throwError(ErrorMessage.UnmatchedBrackets);
  }
};

export const isLeftBracket = (str: string): str is TBracketObject['Left'] => str === Bracket.Left;
export const isRightBracket = (str: string): str is TBracketObject['Right'] => str === Bracket.Right;
export const isBracket = (str: string): str is TBracket => isLeftBracket(str) || isRightBracket(str);
