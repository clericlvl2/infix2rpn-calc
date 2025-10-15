import { describe, expect, it } from 'vitest';
import { Command, ICommand } from '../../token/commands';
import { IOperation } from '../../token/operations/model';

import { Operation } from '../../token/operations/operations';
import { ICommandToken, INumberToken, IOperationToken, TokenType, TRPNToken } from '../../token/token';
import { RPNCalculator } from './RPNCalculator';

const POS = 0;
const num = (v: string): INumberToken => ({ value: v, type: TokenType.Number, position: POS });
const op = (o: IOperation): IOperationToken => ({ value: o, type: TokenType.Operation, position: POS });
const com = (c: ICommand): ICommandToken => ({ value: c, type: TokenType.Command, position: POS });

describe('RPNCalculator', () => {
    it('calculates simple expression', () => {
    // 2 + 3  => RPN: 2 3 +
        const expr: TRPNToken[] = [num('2'), num('3'), op(Operation.Add)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBe(5);
    });

    it('calculates expression with unary minus', () => {
        const expr: TRPNToken[] = [num('5'), op(Operation.UnarySubtract)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBe(-5);
    });

    it('calculates complex expression', () => {
    // (2 + 3) * 4 => RPN: 2 3 + 4 *
        const expr: TRPNToken[] = [num('2'), num('3'), op(Operation.Add), num('4'), op(Operation.Multiply)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBe(20);
    });

    it('throws when RPN notation is invalid', () => {
        const expr: TRPNToken[] = [num('2'), num('3')];
        const calculator = new RPNCalculator(expr);
        expect(() => calculator.calculate()).toThrow();
    });

    it('throws on division by zero', () => {
        const expr: TRPNToken[] = [num('4'), num('0'), op(Operation.Divide)];
        const calculator = new RPNCalculator(expr);
        expect(() => calculator.calculate()).toThrow();
    });

    it('calculates sin command', () => {
        const expr: TRPNToken[] = [num('0'), com(Command.Sin)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(0);
    });

    it('calculates cos command', () => {
        const expr: TRPNToken[] = [num('0'), com(Command.Cos)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(1);
    });

    it('calculates tan command', () => {
        const expr: TRPNToken[] = [num('0'), com(Command.Tan)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(0);
    });

    it('calculates log command', () => {
        const expr: TRPNToken[] = [num('100'), com(Command.Log)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(2);
    });

    it('calculates sqrt command', () => {
        const expr: TRPNToken[] = [num('16'), com(Command.Sqrt)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(4);
    });

    it.skip('calculates ln command', () => {
        const expr: TRPNToken[] = [num(Math.E.toString()), com(Command.Ln)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(1);
    });

    it.skip('calculates exp command', () => {
        const expr: TRPNToken[] = [num('1'), com(Command.Exp)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(Math.E);
    });

    it('calculates factorial command', () => {
        const expr: TRPNToken[] = [num('5'), com(Command.Fact)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBe(120);
    });

    it('throws on negative factorial', () => {
        const expr: TRPNToken[] = [num('-5'), com(Command.Fact)];
        const calculator = new RPNCalculator(expr);
        expect(() => calculator.calculate()).toThrow();
    });

    it('calculates complex expression with commands and operations', () => {
        // sin(0) + 2 * 3 => RPN: 0 sin 2 3 * +
        const expr: TRPNToken[] = [num('0'), com(Command.Sin), num('2'), num('3'), op(Operation.Multiply), op(Operation.Add)];
        const calculator = new RPNCalculator(expr);
        expect(calculator.calculate()).toBeCloseTo(6);
    });
});
