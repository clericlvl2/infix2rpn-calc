import { Stack } from '../../../shared/components/Stack';
import { isExist } from '../../../shared/validation';
import type { IMathOperator } from '../../../shared/math/types';
import {
  isOpeningParenthesis,
  isParenthesis,
  type TParentheses,
} from '../../../shared/math/parentheses';
import type { TEnrichedExpression, TNumberToken } from '../../types';
import { ExpressionTokenType } from '../TokenProcessor/enums';
import { TokenProcessor } from '../TokenProcessor/TokenProcessor';
import { isOperatorToken } from '../TokenProcessor/utils';

export class RPNConverter {
  private operatorsStack: Stack<IMathOperator | TParentheses>;
  private notation: TEnrichedExpression;
  private tokenProcessor: TokenProcessor;

  constructor() {
    this.operatorsStack = new Stack<IMathOperator | TParentheses>();
    this.notation = [];

    this.tokenProcessor = new TokenProcessor({
      supportedTokensTypes: [
        ExpressionTokenType.Number,
        ExpressionTokenType.Operator,
        ExpressionTokenType.Parenthesis,
      ],
      tokenProcessor: {
        [ExpressionTokenType.Number]: this.processTokenChunk.bind(this),
        [ExpressionTokenType.Operator]: this.processOperatorChunk.bind(this),
        [ExpressionTokenType.Parenthesis]: this.processBracketChunk.bind(this),
      },
    });
  }

  public convertToRPN(tokenizedExpression: TEnrichedExpression): (TNumberToken | IMathOperator)[] {
    const converted = this.getConvertedExpression(tokenizedExpression);

    this.resetConverter();

    return converted;
  }

  private getConvertedExpression(tokenizedExpression: TEnrichedExpression): (TNumberToken | IMathOperator)[] {
    tokenizedExpression.forEach(this.tokenProcessor.process);
    this.operatorsStack.popAllTo(this.notation);

    return this.notation;
  }

  private processTokenChunk(chunk: TNumberToken): void {
    this.notation.push(chunk);
  }

  private processOperatorChunk(operator: IMathOperator): void {
    const topStackItem = this.operatorsStack.readTop();
    const topStackItemPrecedence = this.getStackItemPrecedence(topStackItem);

    if (isExist(topStackItem) && operator.precedence <= topStackItemPrecedence) {
      this.operatorsStack.popTopTo(this.notation);
    }

    this.operatorsStack.push(operator);
  }

  private processBracketChunk(chunk: TParentheses): void {
    if (isOpeningParenthesis(chunk)) {
      this.operatorsStack.push(chunk);
      return;
    }

    let token = this.operatorsStack.pop();

    while (token && !isParenthesis(token)) {
      this.notation.push(token);
      token = this.operatorsStack.pop();
    }
  }

  private resetConverter(): void {
    this.notation = [];
    this.operatorsStack.clear();
  }

  private getStackItemPrecedence(item: TParentheses | IMathOperator | undefined): number {
    return !!item && isOperatorToken(item)
      ? item.precedence
      : 0;
  }
}
