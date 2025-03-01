import { filterWhitespaces } from '../common/utils';
import { MathOperator } from './operators/MathOperator';
import type { OperatorRecognizer } from './operators/OperatorRecognizer';
import { Validator } from './Validator';
import { RPNCalculator } from './RPN/RPNCalculator';
import { RPNConverter } from './RPN/RPNConverter';
import type { Tokenizer } from './Tokenizer';
import type { TTokenizedExpression } from './types';

interface ICalculatorOptions<Sign extends string> {
  supportedOperators: MathOperator<Sign>[],
  tokenizer: Tokenizer;
  operatorRecognizer: OperatorRecognizer;
}

export class Calculator<Sign extends string> {
  private readonly supportedOperators: MathOperator<Sign>[];
  private validator: Validator;
  private tokenizer: Tokenizer;
  private operatorRecognizer: OperatorRecognizer;
  private rpnConverter: RPNConverter;
  private rpnCalculator: RPNCalculator;

  constructor({ supportedOperators, operatorRecognizer, tokenizer }: ICalculatorOptions<Sign>) {
    this.supportedOperators = supportedOperators;
    this.tokenizer = tokenizer;
    this.operatorRecognizer = operatorRecognizer;
    this.validator = new Validator({ supportedOperators: supportedOperators });
    this.rpnConverter = new RPNConverter();
    this.rpnCalculator = new RPNCalculator();
  }

  public calculate(expression: string): number {
    const filtered = this.filterWhitespaces(expression);
    const validated = this.validateExpression(filtered);
    const tokenized = this.tokenizer.tokenizeExpression(validated);
    const recognized = this.recognizeOperators(tokenized);

    const rpnConverted = this.rpnConverter.convertToRPN(recognized);

    return this.rpnCalculator.calculate(rpnConverted);
  }

  private recognizeOperators(expression: TTokenizedExpression) {
    const recognized = this.operatorRecognizer.recognizeOperators(expression);

    return this.operatorRecognizer.enrichOperators(recognized, this.supportedOperators);
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
