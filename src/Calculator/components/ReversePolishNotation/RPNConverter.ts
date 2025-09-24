import {Stack} from '@lib/data/Stack';
import {isOpeningParenthesis} from '@lib/math/parentheses';
import {isExist} from '@lib/validation';
import {Token, TokenType} from "@Calculator/components/Tokenizer/model";
import {IOperation} from "@lib/math/operation/model";

export class RPNConverter {
  private operationsStack = new Stack<Token>();
  private notation: Token[] = [];
  private tokenProcessor = {
    [TokenType.Number]: this.processNumberToken,
    [TokenType.Operation]: this.processOperationToken,
    [TokenType.Parenthesis]: this.processParenthesisToken,
  };

  public convert(tokenizedExpression: Token[]): Token[] {
    const converted = this.getConvertedExpression(tokenizedExpression);

    this.reset();

    return converted;
  }

  public reset(): void {
    this.notation = [];
    this.operationsStack.clear();
  }

  private getConvertedExpression(tokenizedExpression: Token[]): Token[] {
    tokenizedExpression.forEach(token => this.tokenProcessor[token.type]?.(token));
    this.operationsStack.popAllTo(this.notation);

    return this.notation;
  }

  private processNumberToken(nToken: Token): void {
    this.notation.push(nToken);
  }

  private processOperationToken(oToken: Token): void {
    const topStackItem = this.operationsStack.readTop();
    const topStackItemPrecedence = this.getStackItemPrecedence(topStackItem);

    if (isExist(topStackItem) && (oToken.value as IOperation).precedence <= topStackItemPrecedence) {
      this.operationsStack.popTopTo(this.notation);
    }

    this.operationsStack.push(oToken);
  }

  private processParenthesisToken(pToken: Token): void {
    if (isOpeningParenthesis(pToken.value)) {
      this.operationsStack.push(pToken);
      return;
    }

    let token = this.operationsStack.pop();

    while (token && token.type !== TokenType.Parenthesis) {
      this.notation.push(token);
      token = this.operationsStack.pop();
    }
  }

  private getStackItemPrecedence(token: Token | undefined): number {
    return isExist(token) && token.type === TokenType.Operation
      ? (token.value as IOperation).precedence
      : 0;
  }
}
