export interface IBaseMathOperator<Sign extends string> {
  arity: number;
  symbol: Sign;
}

export interface IMathOperator<Sign extends string = string> extends IBaseMathOperator<Sign> {
  precedence: number;
  action: (...args: number[]) => number;
}
