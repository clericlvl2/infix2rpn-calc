import { ErrorMessage, throwError } from '../../common/errors';
import { filterWhitespaces, isEmptyString, isString } from '../../common/utils';
import { checkBrackets } from '../brackets/utils';

const checkString = (expression: string): void => {
  if (!isString(expression)) {
    throwError(ErrorMessage.Invalid);
  }
};

const checkEmptyString = (expression: string): void => {
  if (isEmptyString(expression)) {
    throwError(ErrorMessage.Invalid);
  }
};

const checkNotAllowedSymbols = (expression: string): void => {
  const ALLOWED_SYMBOLS_REGEX = /^[0-9+\-/*()d]+$/;

  if (!ALLOWED_SYMBOLS_REGEX.test(expression)) {
    throwError(ErrorMessage.NotAllowedSymbols);
  }
};

/**
 * Выражение не должно начинаться с оператора
 * Не должно быть дублей операторов (++, **)
 * Не понятно что делать с отрицательными числами
 * (нужно отдельно парсить строку и конвертировать -1 + 2 и 2 * (-1) в унарный оператор)
 * Пока не проверяем
 */
const checkOperators = (expression: string): void => {
  return;
};

export const validateExpression = (expression: string): string => {
  checkString(expression);

  const filtered = filterWhitespaces(expression);

  checkEmptyString(filtered);
  checkNotAllowedSymbols(filtered);
  checkBrackets(filtered);
  checkOperators(filtered);

  return filtered;
};
