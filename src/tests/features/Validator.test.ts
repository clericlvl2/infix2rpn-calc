import { Validator } from '@features/calculator/model/Validator';
import * as ValidationLib from '@shared/model/validation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Validator', () => {
    let validator: Validator;

    beforeEach(() => {
        validator = new Validator(['+', '-', '*', '/', '^']);
    });

    describe('constructor', () => {
        it('initializes with supported operators', () => {
            expect(validator).toBeInstanceOf(Validator);
        });

        it('calls regexEscape for each operator symbol', () => {
            const regexEscapeSpy = vi.spyOn<
                { regexEscape: (string: string) => string },
                'regexEscape'
            >(ValidationLib, 'regexEscape');

            new Validator(['+', '-', '*', '/']);

            expect(regexEscapeSpy).toHaveBeenCalledTimes(6);
            expect(regexEscapeSpy).toHaveBeenCalledWith('(');
            expect(regexEscapeSpy).toHaveBeenCalledWith(')');
            expect(regexEscapeSpy).toHaveBeenCalledWith('+');
            expect(regexEscapeSpy).toHaveBeenCalledWith('-');
            expect(regexEscapeSpy).toHaveBeenCalledWith('*');
            expect(regexEscapeSpy).toHaveBeenCalledWith('/');

            regexEscapeSpy.mockRestore();
        });
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

    describe('checkNotAllowedSymbols', () => {
        it('handles expression with only numbers', () => {
            expect(() => validator.checkNotAllowedSymbols('123')).not.toThrow();
        });

        it('handles expression with only operators', () => {
            expect(() => validator.checkNotAllowedSymbols('+')).not.toThrow();
        });

        it('does not throw for expression with only allowed symbols', () => {
            expect(() => validator.checkNotAllowedSymbols('2+2')).not.toThrow();
        });

        it('throws for expression with disallowed symbols', () => {
            expect(() => validator.checkNotAllowedSymbols('2+2$')).toThrow();
        });

        it('handles expression with decimal numbers', () => {
            expect(() => validator.checkNotAllowedSymbols('3.14')).not.toThrow();
        });

        it('handles expressions with special characters in operators', () => {
            const specialOperators = ['√'];
            const specialValidator = new Validator(specialOperators);

            expect(() => specialValidator.checkNotAllowedSymbols('√4')).not.toThrow();
        });
    });

    describe('checkParentheses', () => {
        it('handles expression with only parentheses', () => {
            expect(() => validator.checkParentheses('()')).not.toThrow();
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

    describe('createAllowedSymbolsRegex (private method)', () => {
        it('creates a regex that matches allowed symbols', () => {
            expect(() => validator.checkNotAllowedSymbols('2+2')).not.toThrow();
            expect(() => validator.checkNotAllowedSymbols('3.14*(2-1)')).not.toThrow();
            expect(() => validator.checkNotAllowedSymbols('1+2*3/4^5')).not.toThrow();
        });

        it('creates a regex that rejects disallowed symbols', () => {
            expect(() => validator.checkNotAllowedSymbols('2+2$')).toThrow();
            expect(() => validator.checkNotAllowedSymbols('sin(x)')).toThrow();
            expect(() => validator.checkNotAllowedSymbols('x=2+2')).toThrow();
        });
    });

    it('validates a complete valid expression', () => {
        const expression = '(2+3)*(4/2)';

        expect(() => {
            validator.checkString(expression);
            validator.checkEmptyString(expression);
            validator.checkNotAllowedSymbols(expression);
            validator.checkParentheses(expression);
        }).not.toThrow();
    });

    it('fails validation for an invalid expression with multiple issues', () => {
        const expression = '(2+$)';

        expect(() => {
            validator.checkString(expression);
            validator.checkEmptyString(expression);
            validator.checkNotAllowedSymbols(expression);
        }).toThrow();
    });
});
