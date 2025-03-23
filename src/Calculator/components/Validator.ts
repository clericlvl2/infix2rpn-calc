import { ErrorMessage, throwError } from '@shared/errors';
import type { IMathOperator } from '@shared/math/types';
import { isEmptyString, isString } from '@shared/validation';
import { Parenthesis } from '@shared/math/parentheses';
import { regexEscape } from '@shared/utils';

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
      throwError(ErrorMessage.EmptyExpression);
    }
  };

  public checkNotAllowedSymbols(expression: string): void {
    if (!this.allowedSymbolsRegex.test(expression)) {
      throwError(ErrorMessage.NotAllowedSymbols);
    }
  };

  private getCount(counter: Record<string, number>, chunk: string): number {
    return counter[chunk] ?? 0;
  }

  public checkParentheses(expression: string): void {
    const counter: Record<string, number> = {};

    for (const chunk of expression) {
      if (this.getCount(counter, Parenthesis.Closing) > this.getCount(counter, Parenthesis.Opening)) {
        throwError(ErrorMessage.UnmatchedParentheses);
      }

      counter[chunk] = this.getCount(counter, chunk) + 1;
    }

    if (this.getCount(counter, Parenthesis.Closing) !== this.getCount(counter, Parenthesis.Opening)) {
      throwError(ErrorMessage.UnmatchedParentheses);
    }
  };

  private createAllowedSymbolsRegex(): RegExp {
    const allowedNumbers = '0-9\\.';
    const allowedParentheses = `${regexEscape(Parenthesis.Opening)}${regexEscape(Parenthesis.Closing)}`;
    const allowedSymbols = this.supportedOperators.map((operator) => regexEscape(operator.symbol)).join('');
    const regexString = `^[${allowedNumbers}${allowedParentheses}${allowedSymbols}]+$`;

    return new RegExp(regexString);
  }
}
