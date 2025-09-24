import { isLeftParen, isRightParen, TParen } from '@shared/lib/math';
import { DECIMAL_REGEX, PARENTHESES_REGEX, WHITESPACE_REGEX } from '@shared/model/validation';
import { ErrorMessage } from '../../config/errors';
import {
    createToken,
    EOF_VALUE,
    IEOFToken,
    ILParenToken,
    INumberToken,
    IRawOperationToken,
    IRParenToken,
    IWhitespaceToken,
    TokenType,
} from '../token';
import { LexerStrategy } from './LexerStrategy';

export class WhitespaceStrategy extends LexerStrategy {
    constructor(pattern: RegExp = WHITESPACE_REGEX) {
        super(pattern);
    }

    create(value: string, position: number): IWhitespaceToken {
        return createToken<IWhitespaceToken>({
            value: value,
            type: TokenType.Whitespace,
            position,
            skippable: true,
        });
    }
}

export class EOFStrategy extends LexerStrategy {
    constructor(pattern: RegExp = new RegExp(EOF_VALUE)) {
        super(pattern);
    }

    match(input: string, position: number): string | null {
        return position >= input.length ? EOF_VALUE : null;
    }

    create(_: string, position: number): IEOFToken {
        return createToken<IEOFToken>({
            value: EOF_VALUE,
            type: TokenType.EOF,
            position,
        });
    }
}

export class NumberLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp = DECIMAL_REGEX) {
        super(pattern);
    }

    create(value: string, position: number): INumberToken {
        return createToken<INumberToken>({
            value: value,
            type: TokenType.Number,
            position,
        });
    }
}

export class ParensLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp = PARENTHESES_REGEX) {
        super(pattern);
    }

    create(value: TParen, position: number): ILParenToken | IRParenToken {
        if (isLeftParen(value)) {
            return createToken<ILParenToken>({ value, position, type: TokenType.LParen });
        }

        if (isRightParen(value)) {
            return createToken<IRParenToken>({ value, position, type: TokenType.RParen });
        }

        throw new Error(ErrorMessage.InvalidSymbolFound);
    }
}

export class OperatorLexerStrategy extends LexerStrategy {
    constructor(pattern: RegExp) {
        super(pattern);
    }

    create(value: string, position: number): IRawOperationToken {
        return createToken<IRawOperationToken>({
            value: value,
            type: TokenType.RawOperation,
            position,
        });
    }
}
