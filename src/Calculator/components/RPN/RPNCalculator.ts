import { Stack } from '@shared/components/Stack';
import { ErrorMessage, throwError } from '@shared/errors';
import type { IMathOperator } from '@shared/math/types';

import type { TEnrichedExpression, TNumberToken } from '../../types';
import { ExpressionTokenType } from '../TokenProcessor/enums';
import { TokenProcessor } from '../TokenProcessor/TokenProcessor';

export class RPNCalculator {
  private stack: Stack<number>;
  private tokenProcessor: TokenProcessor;

  constructor() {
    this.stack = new Stack<number>();

    this.tokenProcessor = new TokenProcessor({
      supportedTokensTypes: [
        ExpressionTokenType.Number,
        ExpressionTokenType.Operator,
      ],
      tokenProcessor: {
        [ExpressionTokenType.Number]: this.processToken.bind(this),
        [ExpressionTokenType.Operator]: this.processOperator.bind(this),
      },
    });
  }

  public calculate(expression: TEnrichedExpression): number {
    this.initExpressionCalc(expression);
    const result = this.stack.pop() as number;

    this.checkStack();

    return result;
  }

  public reset() {
    this.stack.clear();
  }

  private initExpressionCalc(expression: TEnrichedExpression): void {
    expression.forEach(this.tokenProcessor.process);
  }

  private checkStack(): void {
    if (this.stack.size()) {
      throwError(ErrorMessage.CalculationError);
    }
  }

  private processToken(chunk: TNumberToken) {
    const token = parseFloat(chunk);

    this.stack.push(token);
  }

  private processOperator(mathOperator: IMathOperator) {
    const actionParameters: number[] = [];

    this.stack.popTo(actionParameters, mathOperator.arity);

    const actionResult = mathOperator.action(...actionParameters.reverse());

    this.stack.push(actionResult);
  }
}
