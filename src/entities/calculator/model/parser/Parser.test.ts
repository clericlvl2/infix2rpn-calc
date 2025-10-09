import { beforeEach, describe, expect, it } from 'vitest';

import { Operation } from '../operations/constants';
import { ArityType } from '../operations/model';
import { Paren } from '../parentheses';
import { TokenType, TParsedToken, TRawToken } from '../token';
import { Parser } from './Parser';
import { RawOperationParserStrategy } from './strategies';

describe('OperationRecognizer', () => {
    const safelyGetArity = (token: TParsedToken): number => token.type === TokenType.Operation
        ? token.value.arity
        : NaN;

    const BINARY_ARITY = ArityType.Binary;
    const UNARY_ARITY = ArityType.Unary;

    const POS = 0;
    const num = (v: string): TRawToken => ({ value: v, type: TokenType.Number, position: POS });
    const op = (v: string): TRawToken => ({ value: v, type: TokenType.RawOperation, position: POS });
    const par = (v: '(' | ')'): TRawToken => v === Paren.Left
        ? ({ value: v, type: TokenType.LParen, position: POS })
        : ({ value: v, type: TokenType.RParen, position: POS });

    const OPERATIONS = [
        Operation.Plus,
        Operation.Minus,
        Operation.UnaryPlus,
        Operation.UnaryMinus,
        Operation.Multiply,
        Operation.Power,
        Operation.Divide,
    ];
    const STRATEGIES = [
        new RawOperationParserStrategy(OPERATIONS),
    ];

    let recognizer: Parser;

    beforeEach(() => {
        recognizer = new Parser(STRATEGIES);
    });

    it('recognizes binary operators in a simple expression', () => {
    // 2 + 3
        const tokenizedExpression: TRawToken[] = [num('2'), op('+'), num('3')];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: '2', type: TokenType.Number, position: POS },
            { value: Operation.Plus, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
        ]);
    });

    it('recognizes multiple operators with different precedence', () => {
    // 2 + 3 * 4
        const tokenizedExpression: TRawToken[] = [num('2'), op('+'), num('3'), op('*'), num('4')];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: '2', type: TokenType.Number, position: POS },
            { value: Operation.Plus, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: Operation.Multiply, type: TokenType.Operation, position: POS },
            { value: '4', type: TokenType.Number, position: POS },
        ]);
    });

    it('recognizes unary operators', () => {
        const tokenizedExpression: TRawToken[] = [op('-'), num('5')];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: Operation.UnaryMinus, type: TokenType.Operation, position: POS },
            { value: '5', type: TokenType.Number, position: POS },
        ]);
    });

    it('recognizes unary operators after opening parenthesis', () => {
    // ( - 5 )
        const tokenizedExpression: TRawToken[] = [par('('), op('-'), num('5'), par(')')];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: '(', type: TokenType.LParen, position: POS },
            { value: Operation.UnaryMinus, type: TokenType.Operation, position: POS },
            { value: '5', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
        ]);
    });

    it('handles complex expressions with parentheses', () => {
    // 2 * ( 3 + 4 ) / 5
        const tokenizedExpression: TRawToken[] = [
            num('2'),
            op('*'),
            par('('),
            num('3'),
            op('+'),
            num('4'),
            par(')'),
            op('/'),
            num('5'),
        ];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: '2', type: TokenType.Number, position: POS },
            { value: Operation.Multiply, type: TokenType.Operation, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: Operation.Plus, type: TokenType.Operation, position: POS },
            { value: '4', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
            { value: Operation.Divide, type: TokenType.Operation, position: POS },
            { value: '5', type: TokenType.Number, position: POS },
        ]);
    });

    it('handles nested parentheses', () => {
    // (( 1 + 2 ) * 3 )
        const tokenizedExpression: TRawToken[] = [
            par('('),
            par('('),
            num('1'),
            op('+'),
            num('2'),
            par(')'),
            op('*'),
            num('3'),
            par(')'),
        ];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: '(', type: TokenType.LParen, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: '1', type: TokenType.Number, position: POS },
            { value: Operation.Plus, type: TokenType.Operation, position: POS },
            { value: '2', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
            { value: Operation.Multiply, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
        ]);
    });

    it('throws error for unsupported operators', () => {
    // 2 % 3
        const tokenizedExpression: TRawToken[] = [num('2'), op('%'), num('3')];

        expect(() => recognizer.parse(tokenizedExpression)).toThrow();
    });

    it('throws error for invalid expression without right operand', () => {
        const tokenizedExpression: TRawToken[] = [num('2'), op('+')];

        expect(() => recognizer.parse(tokenizedExpression)).toThrow();
    });

    it('throws error for incorrect unary operator usage', () => {
        const tokenizedExpression: TRawToken[] = [op('-'), op('+')];

        expect(() => recognizer.parse(tokenizedExpression)).toThrow();
    });

    it('correctly converts tokens to recognized operators', () => {
    // 2 + 3
        const tokenizedExpression: TRawToken[] = [num('2'), op('+'), num('3')];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toEqual([
            { value: '2', type: TokenType.Number, position: POS },
            { value: Operation.Plus, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
        ]);
    });

    it('determines binary arity for operators between two numbers', () => {
    // 2 + 3
        const tokenizedExpression: TRawToken[] = [num('2'), op('+'), num('3')];
        const result = recognizer.parse(tokenizedExpression);

        expect(safelyGetArity(result[1])).toBe(BINARY_ARITY);
    });

    it('determines unary arity for operators at the beginning', () => {
        const tokenizedExpression: TRawToken[] = [op('-'), num('3')];
        const result = recognizer.parse(tokenizedExpression);

        expect(safelyGetArity(result[0])).toBe(UNARY_ARITY);
    });

    it('determines unary arity for operators after opening parenthesis', () => {
    // ( - 3 )
        const tokenizedExpression: TRawToken[] = [par('('), op('-'), num('3'), par(')')];
        const result = recognizer.parse(tokenizedExpression);

        expect(safelyGetArity(result[1])).toBe(UNARY_ARITY);
    });

    it('handles empty expression', () => {
        const emptyTokenizedExpression: TRawToken[] = [];
        const result = recognizer.parse(emptyTokenizedExpression);

        expect(result).toEqual([]);
    });

    it('handles empty parentheses', () => {
        const emptyTokenizedExpression: TRawToken[] = [par('('), par(')')];
        const result = recognizer.parse(emptyTokenizedExpression);

        expect(result).toEqual([par('('), par(')')]);
    });

    it('handles expression with only numbers', () => {
        const tokenizedExpression: TRawToken[] = [num('5')];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toEqual([{ value: '5', type: TokenType.Number, position: POS }]);
    });

    it('handles consecutive unary operators with parentheses', () => {
    // - ( - 3 )
        const tokenizedExpression: TRawToken[] = [op('-'), par('('), op('-'), num('3'), par(')')];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: Operation.UnaryMinus, type: TokenType.Operation, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: Operation.UnaryMinus, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
        ]);
    });

    it('throws consecutive unary operators without parentheses', () => {
    // 2 + - 3
        const tokenizedExpression: TRawToken[] = [num('2'), op('+'), op('-'), num('3')];

        expect(() => recognizer.parse(tokenizedExpression)).toThrow();
    });

    it('correctly processes a complex mathematical expression', () => {
    // 2 * ( -3 + 4 ) / 5
        const tokenizedExpression: TRawToken[] = [
            num('2'),
            op('*'),
            par('('),
            op('-'),
            num('3'),
            op('+'),
            num('4'),
            par(')'),
            op('/'),
            num('5'),
        ];
        const result = recognizer.parse(tokenizedExpression);

        expect(result).toHaveLength(tokenizedExpression.length);
        expect(result).toEqual([
            { value: '2', type: TokenType.Number, position: POS },
            { value: Operation.Multiply, type: TokenType.Operation, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: Operation.UnaryMinus, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: Operation.Plus, type: TokenType.Operation, position: POS },
            { value: '4', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
            { value: Operation.Divide, type: TokenType.Operation, position: POS },
            { value: '5', type: TokenType.Number, position: POS },
        ]);
    });
});
