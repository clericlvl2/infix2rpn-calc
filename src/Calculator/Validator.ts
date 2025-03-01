import { ErrorMessage, throwError } from '../common/errors';
import { isEmptyString, isString, regexEscape } from '../common/utils';
import { Parenthesis } from './parentheses/constants';
import { checkParentheses } from './parentheses/utils';
import type { MathOperator } from './operators/MathOperator';

interface ICalculatorOptions {
  supportedOperators: MathOperator[],
}

export class Validator {
  private supportedOperators: MathOperator[];
  private allowedSymbolsRegex: RegExp;

  constructor({ supportedOperators }: ICalculatorOptions) {
    this.supportedOperators = supportedOperators;
    this.allowedSymbolsRegex = this.createAllowedSymbolsRegex();
  }

  public checkString(expression: string): void {
    if (!isString(expression)) {
      throwError(ErrorMessage.Invalid);
    }
  };

  public checkEmptyString(expression: string): void {
    if (isEmptyString(expression)) {
      throwError(ErrorMessage.Invalid);
    }
  };

  public checkNotAllowedSymbols(expression: string): void {
    if (!this.allowedSymbolsRegex.test(expression)) {
      throwError(ErrorMessage.NotAllowedSymbols);
    }
  };

  public checkParentheses(expression: string): void {
    checkParentheses(expression);
  };

  // TODO execute deep dive to regex to understand this code
  private createAllowedSymbolsRegex(): RegExp {
    const allowedNumbers = '0-9\\.';
    const allowedParentheses = `${regexEscape(Parenthesis.Opening)}${regexEscape(Parenthesis.Closing)}`;
    const allowedSymbols = this.supportedOperators.map((operator) => regexEscape(operator.symbol)).join('');
    const regexString = `^[${allowedNumbers}${allowedParentheses}${allowedSymbols}]+$`;

    return new RegExp(regexString);
  }
}
