export interface IMathOperatorOptions<Sign extends string> {
  priority: number;
  arity: number;
  symbol: Sign;
  action: (...args: number[]) => number;
}

export class MathOperator<Sign extends string> {
  public readonly priority: IMathOperatorOptions<Sign>['priority'];
  public readonly arity: IMathOperatorOptions<Sign>['arity'];
  public readonly symbol: IMathOperatorOptions<Sign>['symbol'];
  public readonly execute: IMathOperatorOptions<Sign>['action'];

  constructor({
    priority,
    arity,
    symbol,
    action,
  }: IMathOperatorOptions<Sign>) {
    this.priority = priority;
    this.arity = arity;
    this.symbol = symbol;
    this.execute = action;

    Object.freeze(this);
  }

  toString() {
    return `Operator (${this.symbol})`;
  }
}
