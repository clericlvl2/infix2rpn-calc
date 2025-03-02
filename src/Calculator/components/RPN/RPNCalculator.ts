import { Stack } from '../../../shared/components/Stack';
import { ErrorMessage, throwError } from '../../../shared/errors';
import type { IMathOperator } from '../../../shared/math/types';

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

    return this.getStackItemIfLast();
  }

  private initExpressionCalc(expression: TEnrichedExpression): void {
    expression.forEach(this.tokenProcessor.process);
  }

  private checkStackLastItem(): void {
    if (this.stack.size() !== 1) {
      throwError(ErrorMessage.CalculationError);
    }
  }

  private getStackItemIfLast(): number {
    this.checkStackLastItem();

    return this.stack.pop() as number;
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
