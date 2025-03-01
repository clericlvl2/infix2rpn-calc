import { Stack } from '../../common/components/Stack';
import { isExist } from '../../common/utils';
import { PARENTHESES_PRECEDENCE, type TParentheses } from '../parentheses/constants';
import { isParenthesis, isOpeningParenthesis } from '../parentheses/utils';
import { MathOperator } from '../operators/MathOperator';
import type { TEnrichedExpression, TNumberToken } from '../types';
import { ExpressionTokenType } from '../tokenProcessor/enums';
import { TokenProcessor } from '../tokenProcessor/TokenProcessor';

export class RPNConverter {
  private operatorsStack: Stack<MathOperator | TParentheses>;
  private notation: TEnrichedExpression;
  private tokenProcessor: TokenProcessor<TEnrichedExpression[number]>;

  constructor() {
    this.operatorsStack = new Stack<MathOperator | TParentheses>();
    this.notation = [];

    this.tokenProcessor = new TokenProcessor({
      supportedTokensTypes: [
        ExpressionTokenType.Number,
        ExpressionTokenType.Operator,
        ExpressionTokenType.Bracket,
      ],
      tokenProcessor: {
        [ExpressionTokenType.Number]: this.processTokenChunk.bind(this),
        [ExpressionTokenType.Operator]: this.processOperatorChunk.bind(this),
        [ExpressionTokenType.Bracket]: this.processBracketChunk.bind(this),
      },
    });
  }

  public convertToRPN(tokenizedExpression: TEnrichedExpression): (TNumberToken | MathOperator)[] {
    const converted = this.getConvertedExpression(tokenizedExpression);

    this.resetConverter();

    return converted;
  }

  private getConvertedExpression(tokenizedExpression: TEnrichedExpression): (TNumberToken | MathOperator)[] {
    tokenizedExpression.forEach(this.tokenProcessor.process);
    this.operatorsStack.popAllTo(this.notation);

    return this.notation;
  }

  private processTokenChunk(chunk: TNumberToken): void {
    this.notation.push(chunk);
  }

  private processOperatorChunk(operator: MathOperator): void {
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

  private getStackItemPrecedence(item: TParentheses | MathOperator | undefined): number {
    return !!item && this.isOperatorToken(item)
      ? item.precedence
      : PARENTHESES_PRECEDENCE;
  }

  private isOperatorToken(chunk: MathOperator | unknown): chunk is MathOperator {
    return chunk instanceof MathOperator;
  }
}
