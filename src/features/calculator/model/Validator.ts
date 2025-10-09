import { isLeftParen, isRightParen, Paren } from '@shared/lib/math';
import { isEmptyString, isString, regexEscape } from '@shared/model/validation';
import { ErrorMessage } from '../config/errors';

export class Validator {
    private allowedSymbolsRegex: RegExp;

    constructor(operationsList: string[]) {
        this.allowedSymbolsRegex = this.createAllowedSymbolsRegex(operationsList);
    }

    checkString(expression: string): void {
        if (!isString(expression)) {
            throw new Error(ErrorMessage.InvalidExpressionPassed);
        }
    };

    checkEmptyString(expression: string): void {
        if (isEmptyString(expression)) {
            throw new Error(ErrorMessage.EmptyExpressionPassed);
        }
    };

    checkNotAllowedSymbols(expression: string): void {
        if (!this.allowedSymbolsRegex.test(expression)) {
            throw new Error(ErrorMessage.InvalidSymbolFound);
        }
    };

    checkParentheses(expression: string): void {
        let counter = 0;

        for (const chunk of expression) {
            if (counter < 0) {
                throw new Error(ErrorMessage.UnmatchedParenthesesFound);
            }

            if (isLeftParen(chunk)) {
                ++counter;
            }

            if (isRightParen(chunk)) {
                --counter;
            }
        }

        if (counter) {
            throw new Error(ErrorMessage.UnmatchedParenthesesFound);
        }
    };

    isSafeNumber(strNumber: string): boolean {
        const num = parseFloat(strNumber);

        return Number.isSafeInteger(num);
    }

    private createAllowedSymbolsRegex(allowedOperations: string[]): RegExp {
        const allowedNumbers = '0-9\\.';
        const allowedParentheses = `${regexEscape(Paren.Left)}${regexEscape(Paren.Right)}`;
        const allowedSymbols = allowedOperations.map(s => regexEscape(s)).join('');
        const regexString = `^[${allowedNumbers}${allowedParentheses}${allowedSymbols}]+$`;

        return new RegExp(regexString);
    }
}
