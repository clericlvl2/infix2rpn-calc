import { ErrorMessage, throwError } from '../../common/errors';
import { Bracket } from './constants';

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
