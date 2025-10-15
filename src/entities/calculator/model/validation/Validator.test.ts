import { beforeEach, describe, expect, it } from 'vitest';
import { Validator } from './Validator';

describe('Validator', () => {
    let validator: Validator;

    beforeEach(() => {
        validator = new Validator();
    });

    describe('checkString', () => {
        it('does not throw for valid string input', () => {
            expect(() => validator.checkString('2+2')).not.toThrow();
        });

        it('throws for non-string input', () => {
            expect(() => validator.checkString(123 as unknown as string)).toThrow();
        });
    });

    describe('checkEmptyString', () => {
        it('does not throw for non-empty string', () => {
            expect(() => validator.checkEmptyString('2+2')).not.toThrow();
        });

        it('throws for empty string', () => {
            expect(() => validator.checkEmptyString('')).toThrow();
        });
    });

    describe('checkParentheses', () => {
        it('handles expression with only parentheses', () => {
            expect(() => validator.checkParentheses('()')).toThrow();
        });

        it('does not throw for expression with matched parentheses', () => {
            expect(() => validator.checkParentheses('(2+2)')).not.toThrow();
        });

        it('does not throw for expression with multiple matched parentheses', () => {
            expect(() => validator.checkParentheses('((2+2)*(3-1))')).not.toThrow();
        });

        it('throws for expression with unmatched opening parenthesis', () => {
            expect(() => validator.checkParentheses('(2+2')).toThrow();
        });

        it('throws for expression with unmatched closing parenthesis', () => {
            expect(() => validator.checkParentheses('2+2)')).toThrow();
        });

        it('throws for expression with mismatched number of parentheses', () => {
            expect(() => validator.checkParentheses('((2+2)')).toThrow();
        });

        it('throws for parentheses with wrong order', () => {
            expect(() => validator.checkParentheses(')(')).toThrow();
        });

        it('handles deeply nested parentheses', () => {
            const deeplyNested = '('.repeat(100) + '0' + ')'.repeat(100);

            expect(() => validator.checkParentheses(deeplyNested)).not.toThrow();
        });
    });

    it('validates a complete valid expression', () => {
        const expression = '(2+3)*(4/2)';

        expect(() => {
            validator.checkString(expression);
            validator.checkEmptyString(expression);
            validator.checkParentheses(expression);
        }).not.toThrow();
    });
});
