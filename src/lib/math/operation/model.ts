// todo убрать unary pre и post
export enum Arity {
  Unary = 1,
  Binary = 2,
  UnaryPre,
  UnaryPost
}

export enum Suffix {
  Pre,
  Post
}

export type IBinaryOperationArity = {
  arity: 2;
}

export type IUnaryOperationArity = {
  arity: 1;
  suffix: Suffix.Pre | Suffix.Post;
}

export interface IBaseOperation<Sign extends string = string> {
  symbol: Sign;
  precedence: number;
  action: (...args: number[]) => number;
}

export type IOperation<Sign extends string = string> =
  IBaseOperation<Sign> & (IBinaryOperationArity | IUnaryOperationArity);
