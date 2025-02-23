import { MathOperator } from './operators/MathOperator';
import { RPNCalculator } from './RPN/RPNCalculator';
import { RPNConverter } from './RPN/RPNConverter';

export class Calculator<OperatorSign extends string> {
  private rpnConverter: RPNConverter<OperatorSign>;
  private rpnCalculator: RPNCalculator<OperatorSign>;

  constructor(operators: MathOperator<OperatorSign>[]) {
    this.rpnConverter = new RPNConverter(operators);
    this.rpnCalculator = new RPNCalculator<OperatorSign>();
  }

  public calculate(expression: string): number {
    const converted = this.rpnConverter.convertToRPN(expression);

    return this.rpnCalculator.calculate(converted);
  }
}
