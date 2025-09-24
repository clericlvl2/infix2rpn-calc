import {Stack} from '@lib/data/Stack';
import {ErrorMessage} from '@lib/errors';
import {Token, TokenType} from "@Calculator/components/Tokenizer/model";
import {IOperation} from "@lib/math/operation/model";

export class RPNCalculator {
  private stack = new Stack<number>();
  private tokenProcessor = {
    [TokenType.Number]: this.processNumberToken,
    [TokenType.Operation]: this.processOperationToken,
  }

  public calculate(expression: Token[]): number {
    this.initExpressionCalc(expression);
    const result = this.stack.pop() as number;

    this.checkEmptyCalculationStack();

    return result;
  }

  public reset() {
    this.stack.clear();
  }

  private initExpressionCalc(expression: Token[]): void {
    expression.forEach(token => {
      // todo этого быть не должно, нужна типизация
      if (token.type === TokenType.Parenthesis) {
        return;
      }

      this.tokenProcessor[token.type]?.(token)
    });
  }

  private checkEmptyCalculationStack(): void {
    if (this.stack.size()) {
      throw new Error(ErrorMessage.CalculationError);
    }
  }

  private processNumberToken(nToken: Token) {
    const nValue = parseFloat(nToken.value);

    this.stack.push(nValue);
  }

  private processOperationToken(oToken: Token) {
    const actionParameters: number[] = [];
    const operator = oToken.value as IOperation;

    this.stack.popTo(actionParameters, operator.arity);

    const actionResult = operator.action(...actionParameters.reverse());

    this.stack.push(actionResult);
  }
}
