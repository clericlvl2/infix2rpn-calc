import { MathOperator } from './operators/MathOperator';
import { RPNCalculator } from './RPN/RPNCalculator';
import { RPNConverter } from './RPN/RPNConverter';

// TODO 1. Extract Tokenizer
//      2. Extract Validator
//      3. Extract OperatorRecognition
//      4. Add tests for different operators sets
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
