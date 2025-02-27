import { ErrorMessage, throwError } from '../../common/errors';
import { ExpressionChunkType } from './enums';
import { MathOperator } from '../operators/MathOperator';
import { Stack } from '../../common/components/Stack';
import type { TToken } from './types';

// TODO 1. move from check last item, its not robust
//      2. clean from is methods
//      3. extract checker and processor
export class RPNCalculator<Operator extends string> {
  private stack = new Stack<number>();

  private readonly chunkCheckerPipeline = [
    {
      check: this.isToken.bind(this),
      type: ExpressionChunkType.Token,
    },
    {
      check: this.isMathOperator.bind(this),
      type: ExpressionChunkType.Operator,
    },
  ] as const;

  private readonly expressionChunkProcessor = {
    [ExpressionChunkType.Token]: this.processToken.bind(this),
    [ExpressionChunkType.Operator]: this.processOperator.bind(this),
    [ExpressionChunkType.Unknown]: this.processUnknownChunk.bind(this),
  } as const;

  private processUnknownChunk(): void {
    throwError('Expression is unrecognizable');
  }

  private getExpressionChunkType(chunk: TToken | MathOperator<Operator>): keyof typeof this.expressionChunkProcessor {
    const found = this.chunkCheckerPipeline.find(checker => checker.check(chunk));

    return found?.type ?? ExpressionChunkType.Unknown;
  }

  private processExpressionChunk(chunk: TToken | MathOperator<Operator>): void {
    const chunkType = this.getExpressionChunkType(chunk);
    const processor = this.expressionChunkProcessor[chunkType];

    // @ts-ignore
    processor(chunk);
  }

  public calculate(expression: (TToken | MathOperator<Operator>)[]): number {
    this.initExpressionCalc(expression);

    return this.getStackItemIfLast();
  }

  private initExpressionCalc(expression: (TToken | MathOperator<Operator>)[]): void {
    expression.forEach(this.processExpressionChunk.bind(this));
  }

  private checkStackLastItem(): void {
    if (this.stack.size() !== 1) {
      throwError(ErrorMessage.CalculationError);
    }
  }

  private getStackItemIfLast(): number {
    this.checkStackLastItem();

    return this.stack.pop() as number;
  }

  private processOperator(mathOperator: MathOperator<Operator>) {
    const actionParameters: number[] = [];

    this.stack.popTo(actionParameters, mathOperator.arity);

    const actionResult = mathOperator.action(...actionParameters.reverse());

    this.stack.push(actionResult);
  }

  private processToken(chunk: TToken) {
    const token = parseFloat(chunk);

    this.stack.push(token);
  }

  private isToken(chunk: MathOperator<Operator> | TToken): chunk is TToken {
    return !this.isMathOperator(chunk);
  }

  private isMathOperator(chunk: unknown | MathOperator<Operator>): chunk is MathOperator<Operator> {
    return chunk instanceof MathOperator;
  }
}
