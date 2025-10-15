import { beforeEach, describe, expect, it } from 'vitest';
import { Command } from '../token/commands';
import { ArityType } from '../token/operations/model';

import { Operation } from '../token/operations/operations';
import { Paren } from '../token/parentheses';
import { TokenType, TParsedToken, TRawToken } from '../token/token';
import { Parser } from './Parser';
import { RawCommandParserStrategy, RawOperationParserStrategy } from './ParserStrategies';

describe('Parser', () => {
    const safelyGetArity = (token: TParsedToken): number => token.type === TokenType.Operation
        ? token.value.arity
        : NaN;

    const BINARY_ARITY = ArityType.Binary;
    const UNARY_ARITY = ArityType.Unary;

    const POS = 0;
    const num = (v: string): TRawToken => ({ value: v, type: TokenType.Number, position: POS });
    const op = (v: string): TRawToken => ({ value: v, type: TokenType.RawOperation, position: POS });
    const cmd = (v: string): TRawToken => ({ value: v, type: TokenType.RawCommand, position: POS });
    const par = (v: '(' | ')'): TRawToken => v === Paren.Left
        ? ({ value: v, type: TokenType.LParen, position: POS })
        : ({ value: v, type: TokenType.RParen, position: POS });

    const OPERATIONS = [
        Operation.Add,
        Operation.Subtract,
        Operation.UnaryAdd,
        Operation.UnarySubtract,
        Operation.Multiply,
        Operation.Power,
        Operation.Divide,
    ];

    const COMMANDS = [
        Command.Sin,
        Command.Cos,
        Command.Tan,
        Command.Log,
        Command.Ln,
        Command.Sqrt,
        Command.Exp,
        Command.Fact,
    ];

    const STRATEGIES = [
        new RawOperationParserStrategy(OPERATIONS),
        new RawCommandParserStrategy(COMMANDS),
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
            { value: Operation.Add, type: TokenType.Operation, position: POS },
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
            { value: Operation.Add, type: TokenType.Operation, position: POS },
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
            { value: Operation.UnarySubtract, type: TokenType.Operation, position: POS },
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
            { value: Operation.UnarySubtract, type: TokenType.Operation, position: POS },
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
            { value: Operation.Add, type: TokenType.Operation, position: POS },
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
            { value: Operation.Add, type: TokenType.Operation, position: POS },
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
            { value: Operation.Add, type: TokenType.Operation, position: POS },
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
            { value: Operation.UnarySubtract, type: TokenType.Operation, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: Operation.UnarySubtract, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
        ]);
    });

    it('recognizes simple command with parentheses', () => {
        // sin ( 3 )
        const tokenized: TRawToken[] = [
            cmd(Command.Sin.symbol),
            par('('),
            num('3'),
            par(')'),
        ];
        const result = recognizer.parse(tokenized);

        expect(result).toHaveLength(tokenized.length);
        expect(result).toEqual([
            { value: Command.Sin, type: TokenType.Command, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
        ]);
    });

    it('recognizes nested commands', () => {
        // cos ( sin ( 0 ) )
        const tokenized: TRawToken[] = [
            cmd(Command.Cos.symbol),
            par('('),
            cmd(Command.Sin.symbol),
            par('('),
            num('0'),
            par(')'),
            par(')'),
        ];
        const result = recognizer.parse(tokenized);

        expect(result).toHaveLength(tokenized.length);
        expect(result).toEqual([
            { value: Command.Cos, type: TokenType.Command, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: Command.Sin, type: TokenType.Command, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
            { value: '0', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
        ]);
    });

    it('allows command followed by a number without parentheses (token recognition only)', () => {
        // sqrt 9
        const tokenized: TRawToken[] = [
            cmd(Command.Sqrt.symbol),
            num('9'),
        ];
        const result = recognizer.parse(tokenized);

        expect(result).toEqual([
            { value: Command.Sqrt, type: TokenType.Command, position: POS },
            { value: '9', type: TokenType.Number, position: POS },
        ]);
    });

    it('mixes commands with operations', () => {
        // sqrt 9 + 1
        const tokenized: TRawToken[] = [
            cmd(Command.Sqrt.symbol),
            num('9'),
            op('+'),
            num('1'),
        ];
        const result = recognizer.parse(tokenized);

        expect(result).toHaveLength(tokenized.length);
        expect(result).toEqual([
            { value: Command.Sqrt, type: TokenType.Command, position: POS },
            { value: '9', type: TokenType.Number, position: POS },
            { value: Operation.Add, type: TokenType.Operation, position: POS },
            { value: '1', type: TokenType.Number, position: POS },
        ]);
    });

    it('throws error for unsupported/unknown command', () => {
        const tokenized: TRawToken[] = [
            cmd('non_existing_command'),
            num('1'),
        ];
        expect(() => recognizer.parse(tokenized)).toThrow();
    });

    it('interoperates with unary operations around commands', () => {
        // - sin ( 3 )
        const tokenized: TRawToken[] = [
            op('-'),
            cmd(Command.Sin.symbol),
            par('('),
            num('3'),
            par(')'),
        ];
        const result = recognizer.parse(tokenized);

        expect(result).toEqual([
            { value: Operation.UnarySubtract, type: TokenType.Operation, position: POS },
            { value: Command.Sin, type: TokenType.Command, position: POS },
            { value: '(', type: TokenType.LParen, position: POS },
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
            { value: Operation.UnarySubtract, type: TokenType.Operation, position: POS },
            { value: '3', type: TokenType.Number, position: POS },
            { value: Operation.Add, type: TokenType.Operation, position: POS },
            { value: '4', type: TokenType.Number, position: POS },
            { value: ')', type: TokenType.RParen, position: POS },
            { value: Operation.Divide, type: TokenType.Operation, position: POS },
            { value: '5', type: TokenType.Number, position: POS },
        ]);
    });
});
