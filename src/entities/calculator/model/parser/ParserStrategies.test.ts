import { describe, expect, it } from 'vitest';
import { Command } from '../token/commands';
import { ArityType } from '../token/operations/model';
import { Operation } from '../token/operations/operations';
import { IEOFToken, INumberToken, IRawCommandToken, IRawOperationToken, TokenType, TRawToken } from '../token/token';
import { RawCommandParserStrategy, RawOperationParserStrategy } from './ParserStrategies';

describe('Parser Strategies', () => {
    const POS = 1;

    const num = (v: string, pos: number = 0): INumberToken => ({ value: v, type: TokenType.Number, position: pos });
    const rawOp = (v: string, pos: number = POS): IRawOperationToken => ({ value: v, type: TokenType.RawOperation, position: pos });
    const rawCmd = (v: string): IRawCommandToken => ({ value: v, type: TokenType.RawCommand, position: POS });
    const eof = (): IEOFToken => ({ value: '', type: TokenType.EOF, position: POS });

    describe('RawOperationParserStrategy', () => {
        const OPERATIONS = [
            Operation.Add,
            Operation.UnaryAdd,
            Operation.Subtract,
            Operation.UnarySubtract,
            Operation.Multiply,
            Operation.Divide,
        ];

        const strategy = new RawOperationParserStrategy(OPERATIONS);

        it('matches raw operation tokens', () => {
            const token = rawOp('+');
            expect(strategy.match(token)).toBe(true);
        });

        it('not matches non-operation tokens', () => {
            expect(strategy.match(num('123'))).toBe(false);
            expect(strategy.match(rawCmd('sin'))).toBe(false);
            expect(strategy.match(eof() as never)).toBe(false);
        });

        it('creates binary operation tokens when operands exist on both sides', () => {
            const expression: TRawToken[] = [num('2'), rawOp('+'), num('3')];
            const token = rawOp('+');

            const result = strategy.create(token, expression, 1);

            expect(result.type).toBe(TokenType.Operation);
            expect(result.value.symbol).toBe('+');
            expect(result.value.arity).toBe(ArityType.Binary);
            expect(result.position).toBe(POS);
        });

        it('creates unary operation tokens when operand exists only on the right side', () => {
            const expression: TRawToken[] = [rawOp('-'), num('5')];
            const token = rawOp('-', 0);

            const result = strategy.create(token, expression, 0);

            expect(result.type).toBe(TokenType.Operation);
            expect(result.value.symbol).toBe('-');
            expect(result.value.arity).toBe(ArityType.Unary);
        });

        it('throws for invalid operation contexts', () => {
            const expression: TRawToken[] = [rawOp('+')];
            const token = rawOp('+');

            expect(() => strategy.create(token, expression, 0)).toThrow();
        });

        it('throws for unknown operations', () => {
            const expression: TRawToken[] = [num('2'), rawOp('?'), num('3')];
            const token = rawOp('?');

            expect(() => strategy.create(token, expression, 1)).toThrow();
        });
    });

    describe('RawCommandParserStrategy', () => {
        const POS = 0;

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

        const strategy = new RawCommandParserStrategy(COMMANDS);

        it('matches raw command tokens', () => {
            const token = rawCmd('sin');
            expect(strategy.match(token)).toBe(true);
        });

        it('not matches non-command tokens', () => {
            expect(strategy.match(num('123'))).toBe(false);
            expect(strategy.match(rawOp('+'))).toBe(false);
            expect(strategy.match(eof() as never)).toBe(false);
        });

        it('creates command tokens for valid commands', () => {
            COMMANDS.forEach((command) => {
                const token = rawCmd(command.symbol);
                const result = strategy.create(token, [], POS);

                expect(result.type).toBe(TokenType.Command);
                expect(result.value).toEqual(command);
            });
        });

        it('throw for unknown commands', () => {
            const token = rawCmd('unknown');
            expect(() => strategy.create(token, [], POS)).toThrow();
        });
    });
});
