import type { IBaseMathOperator } from '@shared/math/types';

export class RecognizedMathOperator<Sign extends string = string> implements IBaseMathOperator<Sign> {
  public readonly arity;
  public readonly symbol;

  constructor({
    arity,
    symbol,
  }: IBaseMathOperator<Sign>) {
    this.arity = arity;
    this.symbol = symbol;

    Object.freeze(this);
  }
}
