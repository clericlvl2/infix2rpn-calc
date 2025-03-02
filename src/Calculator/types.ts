import type { TParentheses } from '../shared/math/parentheses';
import type { IMathOperator } from '../shared/math/types';

export type TUnrecognizedOperator = string
export type TNumberToken = string;
export type TOperand = TParentheses | TNumberToken | undefined;

export type TTokenizedExpression = (TNumberToken | TParentheses | TUnrecognizedOperator)[]
export type TEnrichedExpression = (TNumberToken | TParentheses | IMathOperator)[]
