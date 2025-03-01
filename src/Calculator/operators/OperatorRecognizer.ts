import { ErrorMessage, throwError } from '../../common/errors';
import { isExist, isStrictStringifiedNumber as isNumber } from '../../common/utils';
import { isOpeningParenthesis, isParenthesis } from '../parentheses/utils';
import type { TEnrichedExpression, TOperand, TRecognizedExpression, TTokenizedExpression } from '../types';
import { type IMathOperator, MathOperator, RecognizedMathOperator } from './MathOperator';

enum OperatorArity {
  Unary = 1,
  Binary = 2,
}

export const isUnrecognizedOperator = (value: string) => !isNumber(value) && !isParenthesis(value);

export class OperatorRecognizer {
  recognizeOperators(tokenizedExpression: TTokenizedExpression): TRecognizedExpression {
    const recognizedExpression: TRecognizedExpression = [];

    tokenizedExpression.forEach((token, index, expression) => {
      if (!isUnrecognizedOperator(token)) {
        recognizedExpression.push(token);
        return;
      }

      const leftOperand = expression[index - 1];
      const rightOperand = expression[index + 1];

      const arity = this.determineArity(leftOperand, rightOperand);
      const operator = new RecognizedMathOperator({
        arity,
        symbol: token,
      });

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
    const isExpressionInvalid = !isExist(rightOperand);

    // TODO take operator associativity into account
    if (isExpressionInvalid) {
      throwError(ErrorMessage.Invalid);
    }

    const isUnary =
      !isExist(leftOperand) ||
      isOpeningParenthesis(leftOperand) ||
      isUnrecognizedOperator(leftOperand);

    const isUnaryOperatorInvalid =
      isUnary &&
      isExist(rightOperand) &&
      !isOpeningParenthesis(rightOperand) &&
      !isNumber(rightOperand);

    if (isUnaryOperatorInvalid) {
      throwError(ErrorMessage.IncorrectUnaryOperator);
    }

    return isUnary ? OperatorArity.Unary : OperatorArity.Binary;
  }
}
