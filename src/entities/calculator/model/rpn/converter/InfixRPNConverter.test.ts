import { describe, expect, it } from 'vitest';
import { Command, ICommand } from '../../token/commands';
import { IOperation } from '../../token/operations/model';

import { Operation } from '../../token/operations/operations';
import { Paren } from '../../token/parentheses';
import {
    ICommandToken,
    ILParenToken,
    INumberToken,
    IOperationToken,
    IRParenToken,
    TokenType,
    TParsedToken,
    TRPNToken,
} from '../../token/token';
import { InfixRPNConverter } from './InfixRPNConverter';
import {
    CommandConverterStrategy,
    LParenConverterStrategy,
    NumberConverterStrategy,
    OperationConverterStrategy,
    RParenConverterStrategy,
} from './InfixRPNConverterStrategies';

describe('InfixRPNConverter', () => {
    const POS = 0;
    const num = (v: string): INumberToken => ({ value: v, type: TokenType.Number, position: POS });
    const par = (v: '(' | ')'): ILParenToken | IRParenToken => v === Paren.Left
        ? ({ value: v, type: TokenType.LParen, position: POS })
        : ({ value: v, type: TokenType.RParen, position: POS });
    const op = (o: IOperation): IOperationToken => ({ value: o, type: TokenType.Operation, position: POS });
    const com = (c: ICommand): ICommandToken => ({ value: c, type: TokenType.Command, position: POS });
    const toValue = (arr: TRPNToken[]) => arr.map(t => t.type === TokenType.Operation ? t.value?.symbol : t.value);

    const CONVERTER_STRATEGIES = [
        new NumberConverterStrategy(),
        new LParenConverterStrategy(),
        new RParenConverterStrategy(),
        new OperationConverterStrategy(),
        new CommandConverterStrategy(),
    ];

    it('converts simple addition expression', () => {
        // 5 + 3
        const tokens: TParsedToken[] = [num('5'), op(Operation.Add), num('3')];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', '3', '+']);
    });

    it('handles left associativity', () => {
        // 100 / 10 / 5 => (100 / 10) / 5
        const tokens: TParsedToken[] = [
            num('100'),
            op(Operation.Divide),
            num('10'),
            op(Operation.Divide),
            num('5'),
        ];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['100', '10', '/', '5', '/']);
    });

    it('handles right associativity', () => {
        // 2 ^ 3 ^ 4 => 2 ^ (3 ^ 4)
        const tokens: TParsedToken[] = [
            num('2'),
            op(Operation.Power),
            num('3'),
            op(Operation.Power),
            num('4'),
        ];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['2', '3', '4', '^', '^']);
    });

    it('handles combined associativity', () => {
        // 100 / 50 / 10 ^ 5 ^ 2 => (100 / 50) / (10 ^ (5 ^ 2))
        const tokens: TParsedToken[] = [
            num('100'),
            op(Operation.Divide),
            num('50'),
            op(Operation.Divide),
            num('10'),
            op(Operation.Power),
            num('5'),
            op(Operation.Power),
            num('2'),
        ];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['100', '50', '/', '10', '5', '2', '^', '^', '/']);
    });

    it('converts mixed arithmetic expression', () => {
        // 5 + 3 * 2
        const tokens: TParsedToken[] = [num('5'), op(Operation.Add), num('3'), op(Operation.Multiply), num('2')];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', '3', '2', '*', '+']);
    });

    it('handles simple parenthesized expression', () => {
        // (5 + 3)
        const tokens: TParsedToken[] = [par('('), num('5'), op(Operation.Add), num('3'), par(')')];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', '3', '+']);
    });

    it('handles nested parentheses', () => {
        // (5 + ( 3 * 2 ))
        const tokens: TParsedToken[] = [
            par('('),
            num('5'),
            op(Operation.Add),
            par('('),
            num('3'),
            op(Operation.Multiply),
            num('2'),
            par(')'),
            par(')'),
        ];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', '3', '2', '*', '+']);
    });

    it('handles empty expression', () => {
        const tokens: TParsedToken[] = [];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(result).toEqual([]);
    });

    it('handles empty expression with parentheses', () => {
        const tokens: TParsedToken[] = [par('('), par(')')];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(result).toEqual([]);
    });

    it('handles single number', () => {
        const tokens: TParsedToken[] = [num('42')];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['42']);
    });

    it('converts simple factorial expression', () => {
        // fact(5)
        const tokens: TParsedToken[] = [com(Command.Fact), par('('), num('5'), par(')')];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', Command.Fact]);
    });

    it('converts factorial with multiplication', () => {
        // fact(3) * 2
        const tokens: TParsedToken[] = [
            com(Command.Fact),
            par('('),
            num('3'),
            par(')'),
            op(Operation.Multiply),
            num('2'),
        ];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['3', Command.Fact, '2', '*']);
    });

    it('converts nested factorial expression', () => {
        // (fact(3 + 2) + 3) * 2
        const tokens: TParsedToken[] = [
            par('('),
            com(Command.Fact),
            par('('),
            num('3'),
            op(Operation.Add),
            num('2'),
            par(')'),
            op(Operation.Add),
            num('3'),
            par(')'),
            op(Operation.Multiply),
            num('2'),
        ];
        const converter = new InfixRPNConverter(tokens, CONVERTER_STRATEGIES);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['3', '2', '+', Command.Fact, '3', '+', '2', '*']);
    });
});
