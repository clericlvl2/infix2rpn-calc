import { ErrorMessage, throwError } from '../../common/errors';
import { isStrictStringifiedNumber as isNumber } from '../../common/utils';
import { isBracket, isLeftBracket } from '../brackets/utils';
import { Operator } from '../operators/constants';

const BINARY_MINUS = Operator.Minus.symbol;
const UNARY_MINUS = Operator.UnaryMinus.symbol;

const isOperator = (value: string) => !isNumber(value) && !isBracket(value);

export const parseAndReplaceUnaryMinus = (expression: string) => {
  let convertedArr: string[] = [];

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char !== BINARY_MINUS) {
      convertedArr.push(char);
      continue;
    }

    const prevChar = convertedArr[convertedArr.length - 1] || '';
    const nextChar = expression[i + 1] || '';

    const isFirstChar = i === 0;
    const isUnary = isFirstChar || !!prevChar && isLeftBracket(prevChar) || !!prevChar && isOperator(prevChar);

    if (isUnary) {
      if (!!nextChar && !isLeftBracket(nextChar) && !isNumber(nextChar)) {
        throwError(ErrorMessage.IncorrectUnaryOperator);
      }

      convertedArr.push(UNARY_MINUS);
    } else {
      convertedArr.push(BINARY_MINUS);
    }
  }

  return convertedArr.join('');
};
