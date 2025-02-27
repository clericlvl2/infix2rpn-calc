import { ErrorMessage, throwError } from '../../common/errors';
import { isExist, isStrictStringifiedNumber as isNumber } from '../../common/utils';
import type { TBracket } from '../brackets/constants';
import { isBracket, isLeftBracket } from '../brackets/utils';
import type { TToken } from '../RPN/types';
import { type IMathOperator, MathOperator, RecognizedMathOperator } from './MathOperator';

type TUnrecognizedOperator = string
type TTokenizedExpression = (TToken | TBracket | TUnrecognizedOperator)[]
type TRecognizedExpression = (TToken | TBracket | RecognizedMathOperator)[]
type TEnrichedExpression = (TToken | TBracket | MathOperator)[]
type TOperand = TBracket | TToken | undefined;

const isOperator = (value: string) => !isNumber(value) && !isBracket(value);

enum OperatorArity {
  Unary = 1,
  Binary = 2,
}

export class OperatorRecognizer {
  recognizeOperators(tokenizedExpression: TTokenizedExpression): TRecognizedExpression {
    const recognizedExpression: TRecognizedExpression = [];

    tokenizedExpression.forEach((token, index, expression) => {
      if (!isOperator(token)) {
        recognizedExpression.push(token);
        return;
      }

      const leftOperand = expression[index - 1];
      const rightOperand = expression[index + 1];

      const arity = this.determineArity(leftOperand, rightOperand);
      const symbol = token;
      const operator = new RecognizedMathOperator({ arity, symbol });

      recognizedExpression.push(operator);
    });

    return recognizedExpression;
  }

  enrichOperators(recognizedExpression: TRecognizedExpression, enrichedOperators: IMathOperator[]): TEnrichedExpression {
    const enrichedExpression: TEnrichedExpression = [];
    const enrichedOperatorsMap = new Map<string, IMathOperator>();

    enrichedOperators.forEach(operator => {
      const key = `${operator.symbol}${operator.arity}`;
      enrichedOperatorsMap.set(key, operator);
    });

    recognizedExpression.forEach(token => {
      const isOperator = token instanceof RecognizedMathOperator;

      if (!isOperator) {
        enrichedExpression.push(token);
        return;
      }

      const key = `${token.symbol}${token.arity}`;
      const isSupported = enrichedOperatorsMap.has(key);

      if (!isSupported) {
        throwError(ErrorMessage.HasNotSupportedOperators);
      }

      enrichedExpression.push(enrichedOperatorsMap.get(key) as MathOperator);
    });

    return enrichedExpression;
  }

  private determineArity(leftOperand: TOperand, rightOperand: TOperand): OperatorArity {
    const isUnary =
      !isExist(leftOperand) ||
      isLeftBracket(leftOperand) ||
      isOperator(leftOperand);
    const isRightOperandInvalid =
      isUnary &&
      isExist(rightOperand) &&
      !isLeftBracket(rightOperand) &&
      !isNumber(rightOperand);

    if (isRightOperandInvalid) {
      throwError(ErrorMessage.IncorrectUnaryOperator);
    }

    return isUnary ? OperatorArity.Unary : OperatorArity.Binary;
  }
}
