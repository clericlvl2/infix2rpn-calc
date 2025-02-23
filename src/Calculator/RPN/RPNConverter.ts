import { ErrorMessage, throwError } from '../../common/errors';
import { Stack } from '../../common/components/Stack';
import { isExist } from '../../common/utils';
import { Bracket, BRACKET_PRIORITY, type TBracket } from '../brackets/constants';
import { Operator } from '../operators/constants';
import { MathOperator } from '../operators/MathOperator';
import { ExpressionChunkType } from './enums';
import { TokenAccumulator } from '../../common/components/TokenAccumulator';
import { parseAndReplaceUnaryMinus } from './parseAndReplaceUnaryMinus';
import type { TToken } from './types';
import { validateExpression } from './validation';

// TODO 1. remove validation and tokenization
//      2. clean from is methods
//      3. extract checker and processor
//      4. remove unary hardcode
export class RPNConverter<Operator extends string> {
  private readonly supportedOperators: MathOperator<Operator>[];

  private operatorsStack = new Stack<MathOperator<Operator> | TBracket>();

  private notation: (MathOperator<Operator> | TToken)[] = [];

  private readonly expressionChunkProcessor = {
    [ExpressionChunkType.Token]: this.processTokenChunk.bind(this),
    [ExpressionChunkType.Operator]: this.processOperatorChunk.bind(this),
    [ExpressionChunkType.Bracket]: this.processBracketChunk.bind(this),
    [ExpressionChunkType.Unknown]: this.processUnknownChunk.bind(this),
  } as const;

  private readonly chunkCheckerPipeline = [
    {
      check: this.isTokenChunk.bind(this),
      type: ExpressionChunkType.Token,
    },
    {
      check: this.isOperatorChunk.bind(this),
      type: ExpressionChunkType.Operator,
    },
    {
      check: this.isBracketChunk.bind(this),
      type: ExpressionChunkType.Bracket,
    },
  ] as const;

  constructor(operators: MathOperator<Operator>[]) {
    this.supportedOperators = operators;
  }

  private convertUnaryOperatorsIfNeeded(expression:string) {
    if (this.supportedOperators.find(operator => operator === Operator.UnaryMinus)) {
      return parseAndReplaceUnaryMinus(expression);
    }

    return expression;
  }

  public convertToRPN(expression: string): (TToken | MathOperator<Operator>)[] {
    const validated = validateExpression(expression);
    const converted = this.convertUnaryOperatorsIfNeeded(validated);
    const tokenized = this.tokenizeExpression(converted);
    const output = this.getConvertedExpression(tokenized);

    this.resetNotationAndOperatorsStack();

    return output;
  }

  private tokenizeExpression(expression: string): string[] {
    const tokenized: string[] = [];
    const tokenAccumulator = new TokenAccumulator();

    for (let chunk of expression) {
      if (this.isTokenChunk(chunk)) {
        tokenAccumulator.add(chunk);
      } else {
        tokenAccumulator.flushTo(tokenized);
        tokenized.push(chunk);
      }
    }

    tokenAccumulator.flushTo(tokenized);

    return tokenized;
  }

  private getConvertedExpression(tokenizedExpression: string[]): (TToken | MathOperator<Operator>)[] {
    this.initExpressionConversion(tokenizedExpression);
    this.operatorsStack.popAllTo(this.notation);

    return this.notation;
  }

  private initExpressionConversion(tokenizedExpression: string[]) {
    tokenizedExpression.forEach(this.processExpressionChunk.bind(this));
  }

  /* Утилиты для обработки элемента математического выражения */

  private processExpressionChunk(chunk: string): void {
    const chunkType = this.getExpressionChunkType(chunk);
    const processor = this.expressionChunkProcessor[chunkType];

    // @ts-ignore
    processor(chunk);
  }

  private getExpressionChunkType(chunk: string): ExpressionChunkType {
    const found = this.chunkCheckerPipeline.find(checker => checker.check(chunk));

    return found?.type ?? ExpressionChunkType.Unknown;
  }

  private processTokenChunk(chunk: TToken): void {
    this.addToNotation(chunk);
  }

  private processOperatorChunk(chunk: Operator): void {
    const operatorPriority = this.getChunkOperatorPriority(chunk);
    const topItem = this.operatorsStack.readTop();
    const topItemPriority = this.getStackItemPriority(topItem);

    if (isExist(topItem) && operatorPriority <= topItemPriority) {
      this.operatorsStack.popTopTo(this.notation);
    }

    const mathOperator = this.getMathOperator(chunk);

    if (isExist(mathOperator)) {
      this.addToOperatorsStack(mathOperator);
    }
  }

  private processBracketChunk(chunk: TBracket): void {
    if (chunk === Bracket.Left) {
      return this.addToOperatorsStack(chunk);
    }

    let token = this.operatorsStack.pop();

    while (token && token !== Bracket.Left && token !== Bracket.Right) {
      this.addToNotation(token);
      token = this.operatorsStack.pop();
    }
  }

  private processUnknownChunk(): void {
    throwError(ErrorMessage.Invalid);
  }

  /* Утилиты для работы со стеком операторов и выходной нотацией */

  private resetNotationAndOperatorsStack(): void {
    this.notation = [];
    this.operatorsStack.clear();
  }

  private addToOperatorsStack(chunk: TBracket | MathOperator<Operator>): void {
    this.operatorsStack.push(chunk);
  }

  private addToNotation(chunk: TToken | MathOperator<Operator>): void {
    this.notation.push(chunk);
  }

  private getStackItemPriority(stackItem: TBracket | MathOperator<Operator> | undefined): number {
    return !!stackItem && this.isMathOperator(stackItem)
      ? stackItem.priority
      : BRACKET_PRIORITY;
  }

  /* Утилиты для проверки типа элемента математического выражения */

  private isTokenChunk(chunk: string | TToken): chunk is TToken {
    return !this.isOperatorChunk(chunk) && !this.isBracketChunk(chunk);
  }

  private isBracketChunk(chunk: string | TBracket): chunk is TBracket {
    return chunk === Bracket.Right || chunk === Bracket.Left;
  }

  private isOperatorChunk(chunk: string | Operator): chunk is Operator {
    const mathOperator = this.getMathOperator(chunk);

    return !!mathOperator;
  }

  private isMathOperator(chunk: unknown | MathOperator<Operator>): chunk is MathOperator<Operator> {
    return chunk instanceof MathOperator;
  }

  private getChunkOperatorPriority(chunk: Operator): number {
    const mathOperator = this.getMathOperator(chunk);

    return mathOperator?.priority ?? 0;
  }

  private getMathOperator(chunk: Operator | string): MathOperator<Operator> | undefined {
    return this.supportedOperators.find(o => o.symbol === chunk);
  }
}
