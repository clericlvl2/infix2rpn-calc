import {ErrorMessage} from '@lib/errors';
import type {IOperation} from '@lib/math/operation/model';
import {isEmptyString, isString} from '@lib/validation';
import {isParenthesis, Parenthesis} from '@lib/math/parentheses';
import {regexEscape} from '@lib/utils';

export class Validator {
  private allowedSymbolsRegex: RegExp;

  constructor(private operationsList: IOperation[]) {
    this.allowedSymbolsRegex = this.createAllowedSymbolsRegex(operationsList);
  }

  public checkString(expression: string): void {
    if (!isString(expression)) {
      throw new Error(ErrorMessage.Invalid);
    }
  };

  public checkEmptyString(expression: string): void {
    if (isEmptyString(expression)) {
      throw new Error(ErrorMessage.EmptyExpression);
    }
  };

  public checkNotAllowedSymbols(expression: string): void {
    if (!this.allowedSymbolsRegex.test(expression)) {
      throw new Error(ErrorMessage.NotAllowedSymbols);
    }
  };

  public checkParentheses(expression: string): void {
    const counter = {
      [Parenthesis.Opening]: 0,
      [Parenthesis.Closing]: 0
    };

    for (const chunk of expression) {
      if (!isParenthesis(chunk)) {
        continue;
      }

      if (counter[Parenthesis.Closing] > counter[Parenthesis.Opening]) {
        throw new Error(ErrorMessage.UnmatchedParentheses);
      }

      counter[chunk] += 1;
    }

    if (counter[Parenthesis.Closing] != counter[Parenthesis.Opening]) {
      throw new Error(ErrorMessage.UnmatchedParentheses);
    }
  };

  private createAllowedSymbolsRegex(allowedOperations: IOperation[]): RegExp {
    const allowedNumbers = '0-9\\.';
    const allowedParentheses = `${regexEscape(Parenthesis.Opening)}${regexEscape(Parenthesis.Closing)}`;
    const allowedSymbols = allowedOperations.map((op) => regexEscape(op.symbol)).join('');
    const regexString = `^[${allowedNumbers}${allowedParentheses}${allowedSymbols}]+$`;

    return new RegExp(regexString);
  }
}
