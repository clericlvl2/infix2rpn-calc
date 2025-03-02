import type { IMathOperator } from './types';

export class MathOperator<Sign extends string = string> implements IMathOperator<Sign> {
  public readonly precedence;
  public readonly arity;
  public readonly symbol;
  public readonly action;

  constructor({
    precedence,
    arity,
    symbol,
    action,
  }: IMathOperator<Sign>) {
    this.precedence = precedence;
    this.arity = arity;
    this.symbol = symbol;
    this.action = action;

    Object.freeze(this);
  }
}
