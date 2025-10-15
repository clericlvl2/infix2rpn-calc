import { isEmptyString, isString } from '@shared/lib/validation';
import {
    EmptyExpressionError,
    EmptyParenthesesError,
    InvalidDataTypeError,
    UnmatchedParenthesesError,
} from '../errors';
import { isLeftParen, isRightParen } from '../token/parentheses';

export class Validator {
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
}
