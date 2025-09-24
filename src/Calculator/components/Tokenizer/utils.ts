import {isParenthesis} from '@lib/math/parentheses';
import {isStrictStringifiedNumber as isNumber} from '@lib/validation';
import {IAbstractToken, TokenType} from "@Calculator/components/Tokenizer/model";

export const isOperator = (chunk: string | unknown): chunk is string => !isNumber(chunk) && !isParenthesis(chunk);

export const determineTokenType = (value: string): TokenType => {
  if (isParenthesis(value)) {
    return TokenType.Parenthesis;
  }

  if (isNumber(value)) {
    return TokenType.Number;
  }

  if (isOperator(value)) {
    return TokenType.Operation;
  }

  return TokenType.Unknown;
}
export const createToken = <T extends IAbstractToken>(value: T): Readonly<T> => Object.freeze<T>({...value});
