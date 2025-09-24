import { Operation } from '@features/calculator/config/operations';
import { RPNConverter } from '@features/calculator/model/RPNConverter';
import {
    ILParenToken,
    INumberToken,
    IOperationToken,
    IRParenToken,
    TokenType,
    TParsedToken,
    TRPNToken,
} from '@features/calculator/model/token';
import { IOperation, Paren } from '@shared/lib/math';
import { beforeEach, describe, expect, it } from 'vitest';

const POS = 0;
const num = (v: string): INumberToken => ({ value: v, type: TokenType.Number, position: POS });
const par = (v: '(' | ')'): ILParenToken | IRParenToken => v === Paren.Left
    ? ({ value: v, type: TokenType.LParen, position: POS })
    : ({ value: v, type: TokenType.RParen, position: POS });
const op = (o: IOperation): IOperationToken => ({ value: o, type: TokenType.Operation, position: POS });
const toValue = (arr: TRPNToken[]) => arr.map(t => t.type === TokenType.Operation ? t.value?.symbol : t.value);

describe('RPNConverter', () => {
    let rpnConverter: RPNConverter;

    beforeEach(() => {
        rpnConverter = new RPNConverter();
    });

    it('converts simple addition expression', () => {
    // 5 + 3
        const tokens: TParsedToken[] = [num('5'), op(Operation.Plus), num('3')];

        const result = rpnConverter.convert(tokens);
        expect(toValue(result)).toEqual(['5', '3', '+']);
    });

    it('converts mixed arithmetic expression', () => {
    // 5 + 3 * 2
        const tokens: TParsedToken[] = [num('5'), op(Operation.Plus), num('3'), op(Operation.Multiply), num('2')];

        const result = rpnConverter.convert(tokens);
        expect(toValue(result)).toEqual(['5', '3', '2', '*', '+']);
    });

    it('handles simple parenthesized expression', () => {
    // (5 + 3)
        const tokens: TParsedToken[] = [par('('), num('5'), op(Operation.Plus), num('3'), par(')')];

        const result = rpnConverter.convert(tokens);
        expect(toValue(result)).toEqual(['5', '3', '+']);
    });

    it('handles nested parentheses', () => {
    // (5 + ( 3 * 2 ))
        const tokens: TParsedToken[] = [
            par('('),
            num('5'),
            op(Operation.Plus),
            par('('),
            num('3'),
            op(Operation.Multiply),
            num('2'),
            par(')'),
            par(')'),
        ];

        const result = rpnConverter.convert(tokens);
        expect(toValue(result)).toEqual(['5', '3', '2', '*', '+']);
    });

    it('handles empty expression', () => {
        const tokens: TParsedToken[] = [];

        const result = rpnConverter.convert(tokens);
        expect(result).toEqual([]);
    });

    it('handles empty expression with parentheses', () => {
        const tokens: TParsedToken[] = [par('('), par(')')];

        const result = rpnConverter.convert(tokens);
        expect(result).toEqual([]);
    });

    it('handles single number', () => {
        const tokens: TParsedToken[] = [num('42')];

        const result = rpnConverter.convert(tokens);
        expect(toValue(result)).toEqual(['42']);
    });
});
