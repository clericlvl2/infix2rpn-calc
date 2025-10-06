import {IOperation} from "@lib/math/operation/model";
import {TParentheses} from "@lib/math/parentheses";

export enum TokenType {
  Number = 'number',
  Operation = 'operation',
  RawOperation = 'rawOperation',
  Parenthesis = 'parenthesis',
  Unknown = 'unknown'
}

export type TExpressionTokenType = TokenType.Parenthesis | TokenType.Operation | TokenType.Number;

export interface IAbstractToken {
  value: unknown;
  type: TokenType;
}

export interface IExpressionToken {
  value: unknown;
  type: TokenType.Parenthesis | TokenType.Operation | TokenType.Number;
}

export interface IRawOperationToken {
  value: string;
  type: TokenType.RawOperation;
}

export interface IOperationToken {
  value: IOperation;
  type: TokenType.Operation;
}

export interface INumberToken {
  value: string;
  type: TokenType.Number;
}

export interface IParenthesisToken {
  value: TParentheses
  type: TokenType.Parenthesis;
}

export type TExpressionToken = IRawOperationToken | INumberToken | IParenthesisToken;
export type TExpressionToken2 = IRawOperationToken | INumberToken | IParenthesisToken;

export type Token = IOperationToken | INumberToken | IParenthesisToken | IRawOperationToken;
let abc: TExpressionToken2 = {
  type: TokenType.Parenthesis,
  value: "("
}
