import { Lexer } from '@features/calculator/model/Lexer/Lexer';
import {
    EOFStrategy,
    NumberLexerStrategy,
    OperatorLexerStrategy,
    ParensLexerStrategy,
    WhitespaceStrategy,
} from '@features/calculator/model/Lexer/strategies';
import { TLexerToken, TokenType } from '@features/calculator/model/token';
import { BASIC_ARITHMETIC_REGEX } from '@shared/model/validation';
import { describe, expect, it } from 'vitest';

describe('Lexer', () => {
    const lexerFactory = (input: string) => new Lexer<TLexerToken>(input, [
        new WhitespaceStrategy(),
        new NumberLexerStrategy(),
        new OperatorLexerStrategy(BASIC_ARITHMETIC_REGEX),
        new EOFStrategy(),
        new ParensLexerStrategy(),
    ] as const);

    it('tokenize simple addition expression', () => {
        const expression = '52.5+3';
        const lexer = lexerFactory(expression);
        const res = [
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
        ];

        expect(res).toEqual([
            { value: '52.5', type: TokenType.Number, position: expression.indexOf('5') },
            { value: '+', type: TokenType.RawOperation, position: expression.indexOf('+') },
            { value: '3', type: TokenType.Number, position: expression.indexOf('3') },
            { value: '', type: TokenType.EOF, position: expression.length },
        ]);
    });

    it('returns EOF input for each call after input end', () => {
        const expression = '-(5)';
        const lexer = lexerFactory(expression);
        const res = [
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
        ];

        expect(res).toEqual([
            { value: '-', type: TokenType.RawOperation, position: expression.indexOf('-') },
            { value: '(', type: TokenType.LParen, position: expression.indexOf('(') },
            { value: '5', type: TokenType.Number, position: expression.indexOf('5') },
            { value: ')', type: TokenType.RParen, position: expression.indexOf(')') },
            { value: '', type: TokenType.EOF, position: expression.length },
            { value: '', type: TokenType.EOF, position: expression.length },
            { value: '', type: TokenType.EOF, position: expression.length },
        ]);
    });

    it('handles expression with whitespaces', () => {
        const expression = ' 5  +   3    ';
        const lexer = lexerFactory(expression);
        const res = [
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
            lexer.getNextToken(),
        ];

        expect(res).toEqual([
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: expression.indexOf(' ') },
            { value: '5', type: TokenType.Number, position: expression.indexOf('5') },
            { value: '  ', skippable: true, type: TokenType.Whitespace, position: expression.indexOf('  ') },
            { value: '+', type: TokenType.RawOperation, position: expression.indexOf('+') },
            { value: '   ', skippable: true, type: TokenType.Whitespace, position: expression.indexOf('   ') },
            { value: '3', type: TokenType.Number, position: expression.indexOf('3') },
            { value: '    ', skippable: true, type: TokenType.Whitespace, position: expression.indexOf('    ') },
            { value: '', type: TokenType.EOF, position: expression.length },
        ]);
    });

    it('handles expression with only whitespace', () => {
        const expression = '   ';
        const lexer = lexerFactory(expression);
        const res = [
            lexer.getNextToken(),
            lexer.getNextToken(),
        ];

        expect(res).toEqual([
            { value: '   ', skippable: true, type: TokenType.Whitespace, position: 0 },
            { value: '', type: TokenType.EOF, position: expression.length },
        ]);
    });

    it('returns EOF token when empty string given', () => {
        const expression = '';
        const lexer = lexerFactory(expression);
        const res = [
            lexer.getNextToken(),
        ];

        expect(res).toEqual([
            { value: '', type: TokenType.EOF, position: expression.length },
        ]);
    });

    it.skip('throws when expression contains unrecognizable elements', () => {
        const expression = '5 + a';
        const lexer = lexerFactory(expression);

        expect(() => {
            lexer.getNextToken(); // 5
            lexer.getNextToken(); // +
            lexer.getNextToken(); // Should throw on 'a'
        }).toThrow();
    });

    it('tokenize complex expression', () => {
        const expression = '-(5.5 + 3) * 2 / (1 - 0.5) + 7 * (4.2 - 1.8)';
        const lexer = lexerFactory(expression);
        const res = [];
        let token;
        do {
            token = lexer.getNextToken();
            res.push(token);
        } while (token.type !== TokenType.EOF);

        expect(res).toEqual([
            { value: '-', type: TokenType.RawOperation, position: 0 },
            { value: '(', type: TokenType.LParen, position: 1 },
            { value: '5.5', type: TokenType.Number, position: 2 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 5 },
            { value: '+', type: TokenType.RawOperation, position: 6 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 7 },
            { value: '3', type: TokenType.Number, position: 8 },
            { value: ')', type: TokenType.RParen, position: 9 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 10 },
            { value: '*', type: TokenType.RawOperation, position: 11 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 12 },
            { value: '2', type: TokenType.Number, position: 13 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 14 },
            { value: '/', type: TokenType.RawOperation, position: 15 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 16 },
            { value: '(', type: TokenType.LParen, position: 17 },
            { value: '1', type: TokenType.Number, position: 18 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 19 },
            { value: '-', type: TokenType.RawOperation, position: 20 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 21 },
            { value: '0.5', type: TokenType.Number, position: 22 },
            { value: ')', type: TokenType.RParen, position: 25 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 26 },
            { value: '+', type: TokenType.RawOperation, position: 27 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 28 },
            { value: '7', type: TokenType.Number, position: 29 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 30 },
            { value: '*', type: TokenType.RawOperation, position: 31 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 32 },
            { value: '(', type: TokenType.LParen, position: 33 },
            { value: '4.2', type: TokenType.Number, position: 34 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 37 },
            { value: '-', type: TokenType.RawOperation, position: 38 },
            { value: ' ', skippable: true, type: TokenType.Whitespace, position: 39 },
            { value: '1.8', type: TokenType.Number, position: 40 },
            { value: ')', type: TokenType.RParen, position: 43 },
            { value: '', type: TokenType.EOF, position: expression.length },
        ]);
    });
});
