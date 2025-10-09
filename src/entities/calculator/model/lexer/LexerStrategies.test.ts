import { beforeEach, describe, expect, it } from 'vitest';

import { BASIC_ARITHMETIC_REGEX } from '../operations/constants';
import { TokenType } from '../token';
import { ILexerStrategy } from './model';
import {
    EOFLexerStrategy,
    NumberLexerStrategy,
    OperatorLexerStrategy,
    ParensLexerStrategy,
    WhitespaceLexerStrategy,
} from './strategies';

describe('LexerStrategies', () => {
    describe('NumberLexerStrategy', () => {
        let strategy: ILexerStrategy;

        beforeEach(() => {
            strategy = new NumberLexerStrategy();
        });

        it('matches natural numbers', () => {
            const position = 0;
            const res = [
                strategy.match('2', position),
                strategy.match('312312', position),
                strategy.match('131242543254331243123215', position),
            ];

            expect(res).toEqual([
                '2',
                '312312',
                '131242543254331243123215',
            ]);
        });

        it('matches decimal numbers', () => {
            const position = 0;
            const res = [
                strategy.match('1.5', position),
                strategy.match('0.31231235', position),
                strategy.match('13124254325435.123123123123123', position),
            ];

            expect(res).toEqual([
                '1.5',
                '0.31231235',
                '13124254325435.123123123123123',
            ]);
        });

        it('matches decimal numbers with dot and comma', () => {
            const position = 0;
            const res = [
                strategy.match('123.5123', position),
                strategy.match('123,5123', position),
            ];

            expect(res).toEqual([
                '123.5123',
                '123,5123',
            ]);
        });

        it('matches numbers at arbitrary positions', () => {
            const res = [
                strategy.match('12+3', '12+3'.indexOf('12')),
                strategy.match('1+3+5', '1+3+5'.indexOf('3')),
                strategy.match('173-9*(2-3)', '173-9*(2-3)'.indexOf('2')),
            ];

            expect(res).toEqual(['12', '3', '2']);
        });

        it('does not match when position does not point to a number', () => {
            const res = [
                strategy.match('+5', '+5'.indexOf('+')),
                strategy.match('.1', '.1'.indexOf('.')),
                strategy.match('(1+2)', '(1+2)'.indexOf(')')),
            ];

            expect(res).toEqual([null, null, null]);
        });

        it('does not match non-number values', () => {
            const position = 0;
            const res = [
                strategy.match('', position),
                strategy.match('///', position),
                strategy.match('()', position),
                strategy.match('+', position),
                strategy.match('=+-=_+', position),
                strategy.match('sin', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('does not match for out-of-bound positions', () => {
            const res = [
                strategy.match('123', -24),
                strategy.match('123', 213213),
                strategy.match('123', Infinity),
                strategy.match('123', NaN),
            ];

            console.log(res);

            expect(res.every(r => r === null)).toBe(true);
        });

        it('creates tokens correctly', () => {
            const token = strategy.create('123.5123', 5);

            expect(token).toEqual({
                value: '123.5123',
                type: TokenType.Number,
                position: 5,
            });
        });

        it('does not match empty string or invalid inputs', () => {
            const position = 0;
            const res = [
                strategy.match('', position),
                strategy.match('   ', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });
    });

    describe('ParenthesesLexerStrategy', () => {
        let strategy: ILexerStrategy;

        beforeEach(() => {
            strategy = new ParensLexerStrategy();
        });

        it('matches opening and closing parentheses', () => {
            const position = 0;
            const res = [
                strategy.match('(', position),
                strategy.match(')', position),
            ];

            expect(res).toEqual(['(', ')']);
        });

        it('matches parentheses at arbitrary positions', () => {
            const res = [
                strategy.match('10 + (5 * 2)', '10 + (5 * 2)'.indexOf('(')),
                strategy.match('func(10, 20)', 'func(10, 20)'.indexOf('(')),
                strategy.match('((()))', '((()))'.lastIndexOf('(')),
            ];

            expect(res).toEqual(['(', '(', '(']);
        });

        it('does not match when position does not point to a parenthesis', () => {
            const res = [
                strategy.match('10 + 5 * 2', '10 + 5 * 2'.indexOf('+')),
                strategy.match('func(10, 20)', 'func(10, 20)'.indexOf('1')),
                strategy.match('abc', 'abc'.indexOf('b')),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('does not match non-parentheses characters', () => {
            const position = 0;
            const res = [
                strategy.match('123', position),
                strategy.match('+', position),
                strategy.match('*', position),
                strategy.match('abc', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('does not match for out-of-bound positions', () => {
            const res = [
                strategy.match('(', -1),
                strategy.match(')', 5),
                strategy.match('()', 10),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('creates token correctly', () => {
            const token1 = strategy.create('(', 2);

            expect(token1).toEqual({
                value: '(',
                type: TokenType.LParen,
                position: 2,
            });
        });

        it('does not match empty string or invalid inputs', () => {
            const position = 0;
            const res = [
                strategy.match('', position),
                strategy.match('   ', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });
    });

    describe('OperatorLexerStrategy', () => {
        let strategy: ILexerStrategy;

        beforeEach(() => {
            strategy = new OperatorLexerStrategy(BASIC_ARITHMETIC_REGEX);
        });

        it('matches basic math operators', () => {
            const position = 0;
            const res = [
                strategy.match('+', position),
                strategy.match('-', position),
                strategy.match('*', position),
                strategy.match('/', position),
            ];

            expect(res).toEqual(['+', '-', '*', '/']);
        });

        it('matches operators at arbitrary positions', () => {
            const res = [
                strategy.match('10 + 5', '10 + 5'.indexOf('+')),
                strategy.match('20-3', '20-3'.indexOf('-')),
                strategy.match('5*(3+2*7)', '5*(3+2*7)'.lastIndexOf('*')),
                strategy.match('15/3', '15/3'.indexOf('/')),
            ];

            expect(res).toEqual(['+', '-', '*', '/']);
        });

        it('does not match when position does not point to an operator', () => {
            const res = [
                strategy.match('123', '123'.indexOf('1')),
                strategy.match('(5+2)', '(5+2)'.indexOf('5')),
                strategy.match('abc', 'abc'.indexOf('b')),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('does not match non-operator characters', () => {
            const position = 0;
            const res = [
                strategy.match('123', position),
                strategy.match('abc', position),
                strategy.match('()', position),
                strategy.match('.', position),
                strategy.match('^', position),
                strategy.match('%', position),
                strategy.match('!', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('does not match for out-of-bound positions', () => {
            const res = [
                strategy.match('+', -1),
                strategy.match('-', 5),
                strategy.match('*', 10),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('creates token correctly', () => {
            const token = strategy.create('+', 3);

            expect(token).toEqual({
                value: '+',
                type: TokenType.RawOperation,
                position: 3,
            });
        });

        it('does not match empty string or invalid inputs', () => {
            const position = 0;
            const res = [
                strategy.match('', position),
                strategy.match('   ', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });
    });

    describe('WhitespaceStrategy', () => {
        let strategy: ILexerStrategy;

        beforeEach(() => {
            strategy = new WhitespaceLexerStrategy();
        });

        it('matches whitespace characters', () => {
            const position = 0;
            const res = [
                strategy.match(' ', position),
                strategy.match('\t', position),
                strategy.match('\n', position),
                strategy.match('\r', position),
            ];

            expect(res).toEqual([' ', '\t', '\n', '\r']);
        });

        it('matches whitespace sequences', () => {
            const position = 0;
            const res = [
                strategy.match('   ', position),
                strategy.match('\t\t', position),
                strategy.match(' \t ', position),
                strategy.match(' \n\r ', position),
            ];

            expect(res).toEqual(['   ', '\t\t', ' \t ', ' \n\r ']);
        });

        it('matches whitespace at arbitrary positions', () => {
            const res = [
                strategy.match('10 + 5', '10 + 5'.indexOf(' ')),
                strategy.match('\t123', 0),
                strategy.match('123\n456', '123\n456'.indexOf('\n')),
            ];

            expect(res).toEqual([' ', '\t', '\n']);
        });

        it('does not match when position does not point to whitespace', () => {
            const res = [
                strategy.match('123', '123'.indexOf('1')),
                strategy.match('+ 5', '+ 5'.indexOf('+')),
                strategy.match('(1+2)', '(1+2)'.indexOf('1')),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('does not match non-whitespace characters', () => {
            const position = 0;
            const res = [
                strategy.match('123', position),
                strategy.match('+', position),
                strategy.match('abc', position),
                strategy.match('(', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('does not match for out-of-bound positions', () => {
            const res = [
                strategy.match(' ', -1),
                strategy.match('\t', 5),
                strategy.match('  ', 10),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('creates token correctly', () => {
            const token = strategy.create('  ', 5);

            expect(token).toEqual({
                value: '  ',
                type: TokenType.Whitespace,
                position: 5,
                skippable: true,
            });
        });

        it('does not match empty string or invalid inputs', () => {
            const position = 0;
            const res = [
                strategy.match('', position),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });
    });

    describe('EOFStrategy', () => {
        let strategy: ILexerStrategy;

        beforeEach(() => {
            strategy = new EOFLexerStrategy();
        });

        it('matches end of input', () => {
            const res = [
                strategy.match('', 0),
                strategy.match('123', '123'.length),
                strategy.match('abc', 'abc'.length),
                strategy.match('test', 'test'.length),
            ];

            expect(res).toEqual(['', '', '', '']);
        });

        it('does not match when position is less than 0', () => {
            const res = [
                strategy.match('123', -1),
                strategy.match('abc', -5),
                strategy.match('', -1),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('matches when position is greater than input length', () => {
            const res = [
                strategy.match('123', '123'.length + 1),
                strategy.match('abc', 10),
                strategy.match('', 1),
            ];

            expect(res).toEqual(['', '', '']);
        });

        it('does not match when position is within input', () => {
            const res = [
                strategy.match('123', 0),
                strategy.match('abc', 'abc'.indexOf('b')),
                strategy.match('test', 2),
            ];

            expect(res.every(r => r === null)).toBe(true);
        });

        it('creates token correctly', () => {
            const token = strategy.create('', 5);

            expect(token).toEqual({
                value: '',
                type: TokenType.EOF,
                position: 5,
            });
        });
    });
});
