import { ErrorMessage, throwError } from '../../shared/errors';
import type { IMathOperator } from '../../shared/math/types';
import { isEmptyString, isString } from '../../shared/validation';
import { Parenthesis } from '../../shared/math/parentheses';
import { regexEscape } from '../../shared/utils';

interface ICalculatorOptions {
  supportedOperators: IMathOperator[],
}

export class Validator {
  private supportedOperators: IMathOperator[];
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
    const counter: Record<string, number> = {};

    for (const chunk of expression) {
      const chunkCounter = counter[chunk] ?? 0;

      counter[chunk] = chunkCounter + 1;
    }

    if (counter[Parenthesis.Opening] !== counter[Parenthesis.Closing]) {
      throwError(ErrorMessage.UnmatchedParentheses);
    }
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
