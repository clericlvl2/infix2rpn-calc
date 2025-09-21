import type { TParentheses } from '@lib/math/parentheses';
import type { IMathOperator } from '@lib/math/types';

export type TUnrecognizedOperator = string
export type TNumberToken = string;
export type TOperand = TParentheses | TNumberToken | undefined;

export type TTokenizedExpression = (TNumberToken | TParentheses | TUnrecognizedOperator)[]
export type TEnrichedExpression = (TNumberToken | TParentheses | IMathOperator)[]
