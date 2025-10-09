import { beforeEach, describe, expect, it } from 'vitest';
import { Calculator } from './Calculator';

describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    it('handles basic operations two numbers', () => {
        expect(calculator.calculate('3 + 4')).toBe(7);
        expect(calculator.calculate('10 - 4')).toBe(6);
        expect(calculator.calculate('3 * 5')).toBe(15);
        expect(calculator.calculate('20 / 4')).toBe(5);
    });

    it('handles operators precedence', () => {
        expect(calculator.calculate('3 + 4 * 2')).toBe(11);
    });

    // todo associativity not addressed yet
    it.skip('handles operators associativity', () => {
        expect(calculator.calculate('4 ^ 3 ^ 2')).toBe(262144);
        expect(calculator.calculate('4 + 3 + 2')).toBe(9);
    });

    it('handles parentheses', () => {
        expect(calculator.calculate('(3 + 4) * 2')).toBe(14);
    });

    it('handles unary operations', () => {
        expect(calculator.calculate('-5')).toBe(-5);
        expect(calculator.calculate('+2')).toBe(2);
    });

    it('handles spaces and extra whitespace', () => {
        expect(calculator.calculate('  3   +   4  ')).toBe(7);
        expect(calculator.calculate('     5    +5   ^2')).toBe(30);
        expect(calculator.calculate('5\u2003+\u2002(3\u2001*\u20024)')).toBe(17);
    });

    it('handles zero correctly', () => {
        expect(calculator.calculate('0 + 0')).toBe(0);
        expect(calculator.calculate('0 * 0')).toBe(0);
    });

    it('handles very long expression', () => {
        const expression = '1 + '.repeat(10000) + '1';
        expect(calculator.calculate(expression)).toBe(10001);
    });

    it('handles nested operations', () => {
        expect(calculator.calculate('(3 + 2) * 2')).toBe(10);
        expect(calculator.calculate('((3 + 2) * 2)')).toBe(10);
        expect(calculator.calculate('((5 + 3) * 2) + 1')).toBe(17);
        expect(calculator.calculate('((2 + 3) * (2 + 3)) - 2')).toBe(23);
        expect(calculator.calculate('((1 + 2) * (3 + 4)) / (2 + 1)')).toBe(7);
        expect(calculator.calculate('((5 + 3) * (2 + 2)) - ((7 - 3) * 4)')).toBe(16);
        expect(calculator.calculate('((1 + (2 * 3)) * (4 - (5 / (1 + 1))))')).toBe(10.5);
        expect(calculator.calculate('((10 + 5) * (3 + 2)) / ((4 + 1) * 2)')).toBe(7.5);
    });

    it('allows balanced extra parentheses', () => {
        expect(() => calculator.calculate('((3 + 4))')).not.toThrow();
    });

    it('throws when consecutive operations are not parenthesised', () => {
        expect(() => calculator.calculate('-5 + -4')).toThrow();
        expect(calculator.calculate('-5 + (-4)')).toBe(-9);
        expect(() => calculator.calculate('-+2')).toThrow();
        expect(calculator.calculate('-(+2)')).toBe(-2);
        expect(() => calculator.calculate('3 * / 4')).toThrow();
    });

    it('throws on large numbers exceeding limits', () => {
        expect(() => calculator.calculate('1234567890123456')).toThrow();
        expect(() => calculator.calculate('1234567890123.45')).toThrow();
        expect(() => calculator.calculate('123.123456789')).toThrow();
        expect(() => calculator.calculate('1000000000000000')).toThrow();
        expect(() => calculator.calculate('-1000000000000000')).toThrow();
    });

    it('handles edge case numbers at limits without throwing', () => {
        expect(calculator.calculate('123456789012.45')).toBe(123456789012.45);
        expect(calculator.calculate('123.12345678')).toBe(123.12345678);
        expect(calculator.calculate('999999999999')).toBe(999999999999);
        expect(calculator.calculate('-999999999999')).toBe(-999999999999);
        expect(calculator.calculate('123456789012.345')).toBe(123456789012.345);
    });

    it('throws on division by zero', () => {
        expect(() => calculator.calculate('4 / 0')).toThrow();
    });

    it('throws on missing operands', () => {
        expect(() => calculator.calculate('3 +')).toThrow();
        expect(() => calculator.calculate('   3   4  + ')).toThrow();
    });

    it('throws on unsupported operators', () => {
        expect(() => calculator.calculate('3 % 2')).toThrow();
    });

    it('throws on empty input', () => {
        expect(() => calculator.calculate('')).toThrow();
    });

    // todo think about empty parens behaviour
    it.skip('throws on empty parentheses', () => {
        expect(() => calculator.calculate('()')).toThrow();
    });

    it('throws on non-numeric input', () => {
        expect(() => calculator.calculate('5 + a')).toThrow();
        expect(() => calculator.calculate('5 + @')).toThrow();
    });

    it('throws when parentheses are unbalanced', () => {
        expect(() => calculator.calculate('(3 + 4')).toThrow();
        expect(() => calculator.calculate('3 + 4)')).toThrow();
    });
});
