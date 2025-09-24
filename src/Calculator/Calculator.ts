import type {IOperation} from '@lib/math/operation/model';
import {filterWhitespaces} from '@lib/utils';
import {OperationRecognizer} from '@Calculator/components/OperationRecognizer/OperationRecognizer';
import {RPNCalculator} from '@Calculator/components/ReversePolishNotation/RPNCalculator';
import {RPNConverter} from '@Calculator/components/ReversePolishNotation/RPNConverter';
import {Tokenizer} from './components/Tokenizer/Tokenizer';
import {Validator} from './components/Validator';

interface ICalculatorOptions {
  supportedOperators: IOperation[];
}

// todo
//  tests are broken
//  token is not generic
//  operator vs operation
//  chunk vs token
//  hook for showing rpn notation
//  suffix are not in pipeline

export class Calculator {
  private validator: Validator;
  private tokenizer: Tokenizer;
  private operatorRecognizer: OperationRecognizer;
  private rpnConverter: RPNConverter;
  private rpnCalculator: RPNCalculator;

  constructor({ supportedOperators }: ICalculatorOptions) {
    this.tokenizer = new Tokenizer();
    this.operatorRecognizer = new OperationRecognizer(supportedOperators);
    this.validator = new Validator(supportedOperators);
    this.rpnConverter = new RPNConverter();
    this.rpnCalculator = new RPNCalculator();
  }

  public calculate(expression: string): number {
    this.resetRPN();

    this.validator.checkString(expression);
    const filtered = filterWhitespaces(expression);
    const validated = this.validateExpression(filtered);
    const tokenized = this.tokenizer.tokenize(validated);
    const recognized = this.operatorRecognizer.recognize(tokenized);
    const converted = this.rpnConverter.convert(recognized);

    return this.rpnCalculator.calculate(converted);
  }

  private resetRPN() {
    this.rpnConverter.reset();
    this.rpnCalculator.reset();
  }

  private validateExpression(expression: string) {
    this.validator.checkEmptyString(expression);
    this.validator.checkNotAllowedSymbols(expression);
    this.validator.checkParentheses(expression);

    return expression;
  }
}
