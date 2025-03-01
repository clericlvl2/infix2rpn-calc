import type { TParentheses } from './parentheses/constants';
import type { MathOperator, RecognizedMathOperator } from './operators/MathOperator';

export type TUnrecognizedOperator = string
export type TNumberToken = string;
export type TOperand = TParentheses | TNumberToken | undefined;

export type TTokenizedExpression = (TNumberToken | TParentheses | TUnrecognizedOperator)[]
export type TRecognizedExpression = (TNumberToken | TParentheses | RecognizedMathOperator)[]
export type TEnrichedExpression = (TNumberToken | TParentheses | MathOperator)[]
