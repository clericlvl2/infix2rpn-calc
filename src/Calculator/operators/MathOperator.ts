export interface IBaseMathOperator<Sign extends string> {
  arity: number;
  symbol: Sign;
}

export interface IMathOperator<Sign extends string = string> extends IBaseMathOperator<Sign> {
  precedence: number;
  action: (...args: number[]) => number;
}

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
