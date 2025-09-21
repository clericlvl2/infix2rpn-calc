import { isParenthesis, type TParentheses } from '@lib/math/parentheses';
import type { IMathOperator } from '@lib/math/types';
import { isStrictStringifiedNumber as isNumber } from '@lib/validation';
import type { TNumberToken } from '../../types';

export const isNumberToken = (chunk: TNumberToken | unknown): chunk is TNumberToken => isNumber(chunk);
export const isParenthesisToken = (chunk: TParentheses | unknown): chunk is TParentheses => isParenthesis(chunk);
export const isOperatorToken = (chunk: IMathOperator | unknown): chunk is IMathOperator => {
  return typeof chunk === 'object' &&
    !!(
      chunk?.hasOwnProperty('arity') &&
      chunk?.hasOwnProperty('action') &&
      chunk?.hasOwnProperty('precedence') &&
      chunk?.hasOwnProperty('symbol')
    );
};
