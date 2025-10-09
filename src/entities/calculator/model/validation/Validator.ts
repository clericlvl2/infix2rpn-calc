import { isEmptyString, isString } from '@shared/model/validation';
import {
    EmptyExpressionError,
    EmptyParenthesesError,
    InvalidDataTypeError,
    InvalidSymbolError,
    UnmatchedParenthesesError,
} from '../errors';
import { isLeftParen, isRightParen, Paren } from '../parentheses';

export class Validator {
    private allowedSymbolsRegex: RegExp;

    constructor(operationsList: string[]) {
        this.allowedSymbolsRegex = this.createAllowedSymbolsRegex(operationsList);
    }

    checkString(expression: string): void {
        if (!isString(expression)) {
            throw new InvalidDataTypeError();
        }
    };

    checkEmptyString(expression: string): void {
        if (isEmptyString(expression)) {
            throw new EmptyExpressionError();
        }
    };

    checkNotAllowedSymbols(expression: string): void {
        const result = expression.match(this.allowedSymbolsRegex);

        if (!result || result[0].length !== expression.length) {
            let invalidChar: string | null = null;
            let position: number | null = null;

            for (let i = 0; i < expression.length; i++) {
                const char = expression[i];
                const charMatch = char.match(this.allowedSymbolsRegex);
                if (!charMatch || charMatch[0] !== char) {
                    invalidChar = char;
                    position = i;
                    break;
                }
            }

            throw new InvalidSymbolError(invalidChar ?? 'unknown', position ?? -1);
        }
    };

    checkParentheses(expression: string): void {
        let counter = 0;

        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];

            if (counter < 0) {
                throw new UnmatchedParenthesesError();
            }

            if (isLeftParen(char)) {
                ++counter;

                if (isRightParen(expression[i + 1])) {
                    throw new EmptyParenthesesError();
                }
            }

            if (isRightParen(char)) {
                --counter;
            }
        }

        if (counter) {
            throw new UnmatchedParenthesesError();
        }
    };

    isSafeNumber(strNumber: string): boolean {
        const num = parseFloat(strNumber);

        return Number.isSafeInteger(num);
    }

    private regexEscape(str: string): string {
        return str.replace(/[-\][.*+?^${}()|/]/g, '\\$&');
    };

    private createAllowedSymbolsRegex(allowedOperations: string[]): RegExp {
        const allowedNumbers = '0-9\\.';
        const allowedParentheses = `${this.regexEscape(Paren.Left)}${this.regexEscape(Paren.Right)}`;
        const allowedSymbols = allowedOperations.map(s => this.regexEscape.bind(this)(s)).join('');
        const regexString = `^[${allowedNumbers}${allowedParentheses}${allowedSymbols}]+$`;

        return new RegExp(regexString);
    }
}
