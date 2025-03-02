import { ErrorMessage, throwError } from '../../../shared/errors';
import { isOpeningParenthesis, isParenthesis, type TParentheses } from '../../../shared/math/parentheses';
import type { IMathOperator } from '../../../shared/math/types';
import { isExist, isStrictStringifiedNumber as isNumber } from '../../../shared/validation';
import type { TEnrichedExpression, TNumberToken, TOperand, TTokenizedExpression } from '../../types';
import { RecognizedMathOperator } from './RecognizedMathOperator';

export type TRecognizedExpression = (TNumberToken | TParentheses | RecognizedMathOperator)[]

enum OperatorArity {
  Unary = 1,
  Binary = 2,
}

interface ICalculatorOptions {
  supportedOperators: IMathOperator[],
}

export class MathOperatorRecognizer {
  private supportedOperators: IMathOperator[];

  constructor({ supportedOperators }: ICalculatorOptions) {
    this.supportedOperators = supportedOperators;
  }

  public recognize(tokenizedExpression: TTokenizedExpression): TEnrichedExpression {
    const recognizedExpression = this.recognizeOperators(tokenizedExpression);

    return this.enrichOperators(recognizedExpression);
  }

  private recognizeOperators(tokenizedExpression: TTokenizedExpression): TRecognizedExpression {
    const recognizedExpression: TRecognizedExpression = [];

    tokenizedExpression.forEach((token, index, expression) => {
      if (!this.isUnrecognizedOperator(token)) {
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

  private enrichOperators(recognizedExpression: TRecognizedExpression): TEnrichedExpression {
    const enrichedExpression: TEnrichedExpression = [];
    const enrichedOperatorsMap = new Map<string, IMathOperator>();

    this.supportedOperators.forEach(operator => {
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

      enrichedExpression.push(enrichedOperatorsMap.get(key) as IMathOperator);
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
      this.isUnrecognizedOperator(leftOperand);

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

  private isUnrecognizedOperator = (value: string) => {
    return !isNumber(value) && !isParenthesis(value);
  };
}
