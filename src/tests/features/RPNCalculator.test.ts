import { Operation } from '@features/calculator/config/operations';
import { RPNCalculator } from '@features/calculator/model/RPNCalculator';
import { INumberToken, IOperationToken, TokenType, TRPNToken } from '@features/calculator/model/token';
import { IOperation } from '@shared/lib/math';
import { beforeEach, describe, expect, it } from 'vitest';

const POS = 0;
const num = (v: string): INumberToken => ({ value: v, type: TokenType.Number, position: POS });
const op = (o: IOperation): IOperationToken => ({ value: o, type: TokenType.Operation, position: POS });

describe('RPNCalculator', () => {
    let calculator: RPNCalculator;

    beforeEach(() => {
        calculator = new RPNCalculator();
    });

    it('calculates simple expression', () => {
    // 2 + 3  => RPN: 2 3 +
        const expr: TRPNToken[] = [num('2'), num('3'), op(Operation.Plus)];
        expect(calculator.calculate(expr)).toBe(5);
    });

    it('calculates expression with unary minus', () => {
        const expr: TRPNToken[] = [num('5'), op(Operation.UnaryMinus)];
        expect(calculator.calculate(expr)).toBe(-5);
    });

    it('calculates complex expression', () => {
    // (2 + 3) * 4 => RPN: 2 3 + 4 *
        const expr: TRPNToken[] = [num('2'), num('3'), op(Operation.Plus), num('4'), op(Operation.Multiply)];
        expect(calculator.calculate(expr)).toBe(20);
    });

    // todo dot and comma problem
    it.skip('parses decimal numbers with dot and comma as separators', () => {
        const expr1: TRPNToken[] = [num('3.14')];
        const expr2: TRPNToken[] = [num('3,14')];
        expect(calculator.calculate(expr1)).toBe(3.14);
        expect(calculator.calculate(expr2)).toBe(3.14);
    });

    it('throws when RPN notation is invalid', () => {
        const expr: TRPNToken[] = [num('2'), num('3')];
        expect(() => calculator.calculate(expr)).toThrow();
    });

    it('throws on division by zero', () => {
        const expr: TRPNToken[] = [num('4'), num('0'), op(Operation.Divide)];
        expect(() => calculator.calculate(expr)).toThrow();
    });
});
