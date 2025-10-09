import { describe, expect, it } from 'vitest';

import { Operation } from '../operations/constants';
import { IOperation } from '../operations/model';
import { Paren } from '../parentheses';
import {
    ILParenToken,
    INumberToken,
    IOperationToken,
    IRParenToken,
    TokenType,
    TParsedToken,
    TRPNToken,
} from '../token';
import { InfixRPNConverter } from './InfixRPNConverter';

const POS = 0;
const num = (v: string): INumberToken => ({ value: v, type: TokenType.Number, position: POS });
const par = (v: '(' | ')'): ILParenToken | IRParenToken => v === Paren.Left
    ? ({ value: v, type: TokenType.LParen, position: POS })
    : ({ value: v, type: TokenType.RParen, position: POS });
const op = (o: IOperation): IOperationToken => ({ value: o, type: TokenType.Operation, position: POS });
const toValue = (arr: TRPNToken[]) => arr.map(t => t.type === TokenType.Operation ? t.value?.symbol : t.value);

describe('InfixRPNConverter', () => {
    it('converts simple addition expression', () => {
    // 5 + 3
        const tokens: TParsedToken[] = [num('5'), op(Operation.Plus), num('3')];
        const converter = new InfixRPNConverter(tokens);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', '3', '+']);
    });

    it('converts mixed arithmetic expression', () => {
    // 5 + 3 * 2
        const tokens: TParsedToken[] = [num('5'), op(Operation.Plus), num('3'), op(Operation.Multiply), num('2')];
        const converter = new InfixRPNConverter(tokens);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', '3', '2', '*', '+']);
    });

    it('handles simple parenthesized expression', () => {
    // (5 + 3)
        const tokens: TParsedToken[] = [par('('), num('5'), op(Operation.Plus), num('3'), par(')')];
        const converter = new InfixRPNConverter(tokens);

        const result = converter.convert();
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
        const converter = new InfixRPNConverter(tokens);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['5', '3', '2', '*', '+']);
    });

    it('handles empty expression', () => {
        const tokens: TParsedToken[] = [];
        const converter = new InfixRPNConverter(tokens);

        const result = converter.convert();
        expect(result).toEqual([]);
    });

    it('handles empty expression with parentheses', () => {
        const tokens: TParsedToken[] = [par('('), par(')')];
        const converter = new InfixRPNConverter(tokens);

        const result = converter.convert();
        expect(result).toEqual([]);
    });

    it('handles single number', () => {
        const tokens: TParsedToken[] = [num('42')];
        const converter = new InfixRPNConverter(tokens);

        const result = converter.convert();
        expect(toValue(result)).toEqual(['42']);
    });
});
