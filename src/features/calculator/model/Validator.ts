import { ErrorMessage } from '../config/errors';
import { isParen, Paren } from '@shared/lib/math';
import { isEmptyString, isString, regexEscape } from '@shared/model/validation';

export class Validator {
    private allowedSymbolsRegex: RegExp;

    constructor(operationsList: string[]) {
        this.allowedSymbolsRegex = this.createAllowedSymbolsRegex(operationsList);
    }

    checkString(expression: string): void {
        if (!isString(expression)) {
            throw new Error(ErrorMessage.Invalid);
        }
    };

    checkEmptyString(expression: string): void {
        if (isEmptyString(expression)) {
            throw new Error(ErrorMessage.EmptyExpression);
        }
    };

    checkNotAllowedSymbols(expression: string): void {
        if (!this.allowedSymbolsRegex.test(expression)) {
            throw new Error(ErrorMessage.InvalidSymbolFound);
        }
    };

    checkParentheses(expression: string): void {
        const counter = {
            [Paren.Left]: 0,
            [Paren.Right]: 0,
        };

        for (const chunk of expression) {
            if (!isParen(chunk)) {
                continue;
            }

            if (counter[Paren.Right] > counter[Paren.Left]) {
                throw new Error(ErrorMessage.UnmatchedParenthesesFound);
            }

            counter[chunk] += 1;
        }

        if (counter[Paren.Right] != counter[Paren.Left]) {
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
