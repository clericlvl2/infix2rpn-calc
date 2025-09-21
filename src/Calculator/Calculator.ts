import type { IMathOperator } from '@lib/math/types';
import { filterWhitespaces } from '@lib/utils';
import { MathOperatorRecognizer } from './components/MathOperatorRecognizer/MathOperatorRecognizer';
import { RPNCalculator } from '@Calculator/components/ReversePolishNotation/RPNCalculator';
import { RPNConverter } from '@Calculator/components/ReversePolishNotation/RPNConverter';
import { Tokenizer } from './components/Tokenizer/Tokenizer';
import { Validator } from './components/Validator';

interface ICalculatorOptions<Sign extends string> {
  supportedOperators: IMathOperator<Sign>[];
}

export class Calculator<Sign extends string> {
  private validator: Validator;
  private tokenizer: Tokenizer;
  private operatorRecognizer: MathOperatorRecognizer;
  private rpnConverter: RPNConverter;
  private rpnCalculator: RPNCalculator;

  constructor({ supportedOperators }: ICalculatorOptions<Sign>) {
    this.tokenizer = new Tokenizer();
    this.operatorRecognizer = new MathOperatorRecognizer({ supportedOperators: supportedOperators });
    this.validator = new Validator({ supportedOperators: supportedOperators });
    this.rpnConverter = new RPNConverter();
    this.rpnCalculator = new RPNCalculator();
  }

  public calculate(expression: string): number {
    const filtered = this.filterWhitespaces(expression);
    const validated = this.validateExpression(filtered);
    const tokenized = this.tokenizer.tokenizeExpression(validated);
    const recognized = this.operatorRecognizer.recognize(tokenized);

    this.resetRPN();

    const rpnConverted = this.rpnConverter.convert(recognized);

    return this.rpnCalculator.calculate(rpnConverted);
  }

  private resetRPN() {
    this.rpnConverter.reset();
    this.rpnCalculator.reset();
  }

  private filterWhitespaces(expression: string): string {
    this.validator.checkString(expression);

    const filtered = filterWhitespaces(expression);

    this.validator.checkEmptyString(filtered);

    return filtered;
  }

  private validateExpression(expression: string) {
    this.validator.checkNotAllowedSymbols(expression);
    this.validator.checkParentheses(expression);

    return expression;
  }
}
